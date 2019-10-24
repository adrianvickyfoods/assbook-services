import { Controller, Get, Req, Param, ParseIntPipe, NotFoundException, Put, Body, ValidationPipe, UseGuards, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { AuthGuard } from '@nestjs/passport';
import { FollowUserDto } from './dto/follow-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getCurrentUser(@Req() req) {
        let user = req.user;
        user.me = true;
        return { user };
    }

    @Get(':id')
    async getUser(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
    ) {
        try {
            const user = await this.usersService.getUser(id);
            (user as any).me = user.id === req.user.id;
            return { user };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me')
    async updateUserInfo(
        @Req() req,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) userDto: UpdateUserDto) {
        try {
            await this.usersService.updateUserInfo(req.user.id, userDto);
            return { ok: true };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me/password')
    async updatePassword(
        @Req() req,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) passDto: UpdatePasswordDto) {
        try {
            await this.usersService.updatePassword(req.user.id, passDto);
            return { ok: true };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me/avatar')
    async updateAvatar(
        @Req() req,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) avatarDto: UpdateAvatarDto,
    ) {
        try {
            const avatar = await this.usersService.updateAvatar(req.user.id, avatarDto);
            return { avatar };
        } catch (e) {
            throw new NotFoundException();
        }

    }

    @Get('me/followers')
    async getMyFollowers(@Req() req) {
        return await this.usersService.getFollowers(req.user.id);
    }

    @Get('me/following')
    async getMyFollowing(@Req() req) {
        return await this.usersService.getFollowing(req.user.id);
    }

    @Post('follow')
    async follow(
        @Req() req,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) followDto: FollowUserDto,
    ) {
        return await this.usersService.follow(followDto.id, req.user);
    }

    @Delete('follow/:id')
    async unfollow(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return await this.usersService.unfollow(id, req.user);
    }
}
