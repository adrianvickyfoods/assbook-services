import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { UsersModule } from '../users/users.module';
import { CommonsModule } from '../commons/commons.module';
import { LikePost } from '../entities/like-post.entity';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, LikePost]), UsersModule, CommonsModule, CommentsModule],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
