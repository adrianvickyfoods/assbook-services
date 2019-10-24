import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, Index, AfterInsert, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()

export class Comment {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 1000})
    text: string;

    @CreateDateColumn({type: 'datetime'})
    date: Date;

    @ManyToOne(type => Post, post => post.comments, {nullable: false, cascade: true, onDelete: 'CASCADE'})
    @Index('postId')
    post: Post;

    @ManyToOne(type => User, user => user.comments, {nullable: false, cascade: true, onDelete: 'CASCADE'})
    @Index('userId')
    user: User;
}
