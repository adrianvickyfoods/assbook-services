import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToMany, JoinTable, RelationCount } from 'typeorm';
import { Post } from './post.entity';
import { LikePost } from './like-post.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 200})
    name: string;

    @Column({length: 150, unique: true})
    email: string;

    @Column({length: 100, nullable: true, select: false})
    password: string;

    @Column({length: 100, default: 'img/profile.jpg'})
    avatar: string;

    @OneToMany(type => Post, post => post.creator, {cascade: ['insert']})
    posts: Post[];

    @OneToMany(type => LikePost, like => like.user)
    likes: LikePost[];

    @OneToMany(type => Comment, com => com.post)
    comments: Comment[];

    @ManyToMany(type => User, user => user.following)
    @JoinTable()
    followers: User[];

    @ManyToMany(type => User, user => user.followers)
    following: User[];

    @RelationCount((user: User) => user.followers)
    followersCount: number;

    @RelationCount((user: User) => user.following)
    followingCount: number;
}
