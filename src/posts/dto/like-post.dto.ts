import { Allow, IsNotEmpty } from 'class-validator';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

export class LikePostDto {
    @IsNotEmpty()
    likes: boolean;

    @Allow()
    user: User;

    @Allow()
    post: Post;
}
