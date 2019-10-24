import { Controller, Get, Body, Post, ValidationPipe, Param, ParseIntPipe, Delete, HttpException, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { InsertPostDto } from './dto/insert-post.dto';
import { UsersService } from '../users/users.service';
import { LikePostDto } from './dto/like-post.dto';
import { Post as UserPost } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from '../comments/comments.service';
import { InsertCommentDto } from '../comments/dto/insert-comment.dto';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
    constructor(private readonly postsService: PostsService,
                private readonly usersService: UsersService,
                private readonly commentsService: CommentsService) {}

    @Get()
    async getAllPosts(@Req() req) {
        const posts = await this.postsService.getAllPosts(req.user.id);
        return {posts};
    }

    @Get(':id')
    async getPost(@Param('id', ParseIntPipe) postId: number, @Req() req) {
        try {
            const post = await this.postsService.getPost(postId, req.user.id);
            return {post};
        } catch (e) {
            throw new NotFoundException('Post not found');
        }
    }

    @Post()
    async insertPost(
        @Body(new ValidationPipe({ transform: true, whitelist: true})) postDto: InsertPostDto,
        @Req() req,
    ) {
        postDto.creator = req.user;
        const post = await this.postsService.insertPost(postDto);
        return {post};
    }

    @Delete(':id')
    async deletePost(@Param('id', ParseIntPipe) id: number) {
      const result = await this.postsService.deletePost(id);
      if (result.affected === 0) {
        throw new NotFoundException('Post not found');
      } else {
        return { id };
      }
    }

    @Post(':id/likes')
    async likePost(
        @Param('id', ParseIntPipe) postId: number,
        @Body(new ValidationPipe({ transform: true, whitelist: true})) liketDto: LikePostDto,
        @Req() req,
    ) {
        const post = new UserPost();
        post.id = postId;
        liketDto.post = post;
        const user = new User();
        user.id = req.user.id;
        liketDto.user = user;
        try {
            await this.postsService.likePost(liketDto);
            return { totalLikes: (await this.postsService.getPost(postId)).totalLikes };
        } catch (e) {
            throw new NotFoundException('Post not found');
        }
    }

    @Delete(':id/likes')
    async deleteLikePost(@Param('id', ParseIntPipe) postId: number, @Req() req) {
        try {
            await this.postsService.deleteLikePost(req.user.id, postId);
            return { totalLikes: (await this.postsService.getPost(postId)).totalLikes };
        } catch (e) {
            throw new NotFoundException('Post not found');
        }
    }

    @Get(':id/comments')
    async getComments(@Param('id', ParseIntPipe) postId: number) {
        return { comments: await this.commentsService.getComments(postId) };
    }

    @Post(':id/comments')
    async postComment(
        @Req() req: any,
        @Param('id', ParseIntPipe) postId: number,
        @Body(new ValidationPipe({ transform: true, whitelist: true })) comDto: InsertCommentDto,
    ) {
        comDto.user = req.user.id;
        comDto.post = postId;
        try {
            const comment = await this.commentsService.insertComment(comDto);
            return { comment: await this.commentsService.getComment(comment.id) };
        } catch (e) {
            throw new HttpException('Restaurant not found', 404);
        }
    }

}
