import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, RelationCount } from 'typeorm';
import { User } from './user.entity';
import { LikePost } from './like-post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 100, nullable: true})
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @CreateDateColumn({type: 'timestamp'})
    date: Date;

    @Column({length: 100, nullable: true})
    image: string;

    @Column({type: 'tinyint'})
    mood: number;

    @Column({length: 100, nullable: true})
    place: string;

    @Column({type: 'decimal', precision: 10, scale: 7, nullable: true})
    lat: number;

    @Column({type: 'decimal', precision: 10, scale: 7, nullable: true})
    lng: number;

    @Column({default: 0})
    totalLikes: number;

    @ManyToOne(type => User, user => user.posts, {nullable: false, cascade: true, onDelete: 'RESTRICT'})
    creator: User;

    @OneToMany(type => LikePost, like => like.post)
    likes: LikePost[];

    @OneToMany(type => Comment, com => com.post)
    comments: Comment[];
}