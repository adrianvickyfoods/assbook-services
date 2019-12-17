import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../commons/image/image.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly imageService: ImageService,
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
    ) {}

    async getUser(id: number) {
        return this.usersRepo.findOneOrFail(id);
    }

    async getUserbyEmail(email: string): Promise<User> {
        return this.usersRepo.findOne({email});
    }

    async emailExists(email: string): Promise<boolean> {
        return (await this.usersRepo.findOne({email})) ? true : false;
    }

    async updateUserInfo(id: number, user: UpdateUserDto): Promise<void> {
        await this.usersRepo.update(id, user);
    }

    async updatePassword(id: number, pass: UpdatePasswordDto): Promise<void> {
        await this.usersRepo.update(id, pass);
    }

    async updateAvatar(id: number, avatar: UpdateAvatarDto): Promise<string> {
        avatar.avatar = await this.imageService.saveImage('users', avatar.avatar);
        await this.usersRepo.update(id, avatar);
        return avatar.avatar;
    }

    async getFollowing(id: number) {
        const user = await this.usersRepo.findOne(id, {relations: ['following']});
        return {following: user.following, count: user.followingCount};
    }

    async getFollowers(id: number) {
        const user = await this.usersRepo.findOne(id, {relations: ['followers']});
        return {followers: user.followers, count: user.followersCount};
    }

    async follow(id: number, loggedUser: User) {
        const user = new User();
        user.id = id;
        await this.unfollow(id, loggedUser);
        await this.usersRepo.createQueryBuilder().relation(User, 'following').of(loggedUser).add(user);
        return {id};
    }

    async unfollow(id: number, loggedUser: User) {
        await this.usersRepo.createQueryBuilder().relation(User, 'following').of(loggedUser).remove(id);
        return {id};
    }
}
