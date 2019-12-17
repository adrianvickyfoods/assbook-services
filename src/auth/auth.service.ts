import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, DeepPartial } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import * as request from 'request-promise';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageService } from '../commons/image/image.service';

import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { LoginTokenDto } from './dto/login-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JWT_KEY') private jwtKey: string,
        @Inject('JWT_EXPIRATION') private jwtExpiration: number,
        @Inject('GOOGLE_ID') private googleId: string,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly imageService: ImageService,
        private readonly usersService: UsersService,
    ) { }

    private createToken(user: User) {
        const data: JwtPayload = {
            id: user.id,
        };
        const expiresIn = this.jwtExpiration;
        const accessToken = jwt.sign(data, this.jwtKey, { expiresIn });
        return {
            expiresIn,
            accessToken,
        };
    }

    async registerUser(userDto: RegisterUserDto) {
        userDto.avatar = await this.imageService.saveImage('users', userDto.avatar);
        await this.userRepo.insert(userDto);
        return userDto;
    }

    async login(userDto: LoginUserDto) {
        const user = await this.userRepo.findOneOrFail({email: userDto.email, password: userDto.password});
        return this.createToken(user);
    }

    async loginGoogle(tokenDto: LoginTokenDto) {
        const client = new OAuth2Client(this.googleId);
        const ticket = await client.verifyIdToken({
            idToken: tokenDto.token,
            audience: this.googleId,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        let user = await this.usersService.getUserbyEmail(email);
        const avatar = await this.imageService.downloadImage('users', payload.picture);
        if (!user) {
            const user2: DeepPartial<User> = {
                email,
                name: payload.name,
                avatar,
            };
            await this.userRepo.save(user2);
            user = await this.usersService.getUserbyEmail(email);
        }
        if (tokenDto.oneSignalId) {
            user.oneSignalId = tokenDto.oneSignalId;
            await this.userRepo.update(user.id, {oneSignalId: tokenDto.oneSignalId});
        }
        return this.createToken(user as User);
    }

    async loginFacebook(tokenDto: LoginTokenDto) {
        const options = {
            method: 'GET',
            uri: 'https://graph.facebook.com/me',
            qs: {
                access_token: tokenDto.token,
                fields: 'id,name,email',
            },
            json: true,
        };
        const respUser = await request(options);

        let user: DeepPartial<User> = await this.usersService.getUserbyEmail(respUser.email);

        if (!user) {
            const optionsImg = {
                method: 'GET',
                uri: 'https://graph.facebook.com/me/picture',
                qs: {
                    access_token: tokenDto.token,
                    type: 'large',
                },
            };
            const respImg = request(optionsImg);
            const avatar = await this.imageService.downloadImage('users', respImg.url);
            user = {
                email: respUser.email,
                name: respUser.name,
                avatar,
            };
            user = await this.userRepo.save(user);
        }
        if (tokenDto.oneSignalId) {
            user.oneSignalId = tokenDto.oneSignalId;
            await this.userRepo.update(user.id, {oneSignalId: tokenDto.oneSignalId});
        }

        return this.createToken(user as User);
    }
}
