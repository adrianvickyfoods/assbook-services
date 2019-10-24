import { Entity, PrimaryColumn, ManyToOne, Column, RelationId } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity({name: 'user_like_post'})
export class LikePost {
    @ManyToOne(type => User, user => user.likes, {nullable: false, cascade: true, onDelete: 'CASCADE', primary: true})
    user: User;

    @ManyToOne(type => Post, post => post.likes, {nullable: false, cascade: true, onDelete: 'CASCADE', primary: true})
    post: Post;

    @Column({type: 'boolean'})
    likes: boolean;


}
