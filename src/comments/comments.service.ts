import { Injectable } from '@nestjs/common';
import { InsertCommentDto } from './dto/insert-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { FirebaseService } from '../commons/firebase/firebase.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private readonly comRepo: Repository<Comment>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Post) private readonly postRepo: Repository<Post>,
        private readonly firebaseService: FirebaseService,
    ) {}

    async insertComment(comment: InsertCommentDto): Promise<Comment> {
        const post = await this.postRepo.findOne(comment.post, {loadRelationIds: true});
        const user = await this.userRepo.findOne(post.creator);
        if (user.firebaseToken) {
            await this.firebaseService.sendMessage(user.firebaseToken, user.name, comment.text, {postId: '' + post.id});
        }
        return await this.comRepo.save(comment);
    }

    getComment(commentId: number): Promise<Comment> {
        return this.comRepo.findOne(commentId, {relations: ['user']});
    }

    getComments(postId: number): Promise<Comment[]> {
        return this.comRepo.find({where: {post: postId}, relations: ['user']});
    }
}
