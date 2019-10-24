import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { InsertPostDto } from './dto/insert-post.dto';
import { ImageService } from '../commons/image/image.service';
import { LikePostDto } from './dto/like-post.dto';
import { LikePost } from '../entities/like-post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private readonly postRepo: Repository<Post>,
        @InjectRepository(LikePost) private readonly likePostRepo: Repository<LikePost>,
        private readonly imageService: ImageService,
        @Inject('MAPBOX_TOKEN') private readonly mapboxToken: string,
    ) {}

    private async setIfVoted(posts: Post[], loggedId: number) {
        for (const p of posts) {
            (p as any).vote = await this.likePostRepo.findOne({user: {id: loggedId}, post: {id: p.id}});
            (p as any).mine = p.creator.id === loggedId;
        }

        return posts;
    }

    async getAllPosts(loggedId?: number) {
        const posts = await this.postRepo.find({relations: ['creator']});
        if (loggedId) {
            await this.setIfVoted(posts, loggedId);
        }

        return posts;
    }

    async getPostUser(userId: number, loggedId?: number) {
        const posts = await this.postRepo.find({where: {creator: {id: userId}}, relations: ['creator']});
        if (loggedId) {
            await this.setIfVoted(posts, loggedId);
        }

        return posts;
    }

    async getPost(id: number, loggedId?: number) {
        const p = await this.postRepo.findOne(id, {relations: ['creator']});
        if (loggedId) {
            await this.setIfVoted([p], loggedId);
        }

        return p;
    }

    async insertPost(post: InsertPostDto) {
        if(post.lat && post.lng) {
            const img = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/' +
                'pin-l+f00(' + post.lng + ',' + post.lat + ')/' +
                post.lng + ',' + post.lat + ',15,0,0/800x400?access_token=' + this.mapboxToken;
            post.image = await this.imageService.downloadImage('posts', img);
        } else if (post.image) {
            post.image = await this.imageService.saveImage('posts', post.image);
        }
        const p = await this.postRepo.save(post);
        return p;
    }

    async deletePost(id: number) {
        const post = await this.postRepo.findOne(id);
        if (post.image) {
            try {
                await this.imageService.removeImage(post.image);
            } catch (e) {}
        }

        return await this.postRepo.delete(id);
    }

    async likePost(likePost: LikePostDto) {
        await this.likePostRepo.save(likePost);
    }

    async deleteLikePost(userId: number, postId: number) {
        const result = await this.likePostRepo.createQueryBuilder('user_like_post')
            .delete()
            .where('user.id = :userId AND post.id = :postId', {userId, postId})
            .execute();
        return result.affected;
    }
}
