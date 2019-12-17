import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class ImageUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    return next.handle().pipe(
      map(resp => {
        if (resp.post) {
          resp.post.image = baseUrl + (resp.post as Post).image;
          if (resp.post.creator) {
            resp.post.creator.avatar = baseUrl + (resp.post.creator as User).avatar;
          }
        } else if (resp.posts) {
          resp.posts = resp.posts.map((p: Post) => {
            p.image = baseUrl + p.image;
            if (p.creator) {
              p.creator.avatar = baseUrl + (p.creator as User).avatar;
            }
            return p;
          });
        } else if (resp.user) {
          resp.user.avatar = baseUrl + (resp.user as User).avatar;
        } else if (resp.avatar) {
          resp.avatar = baseUrl + resp.avatar;
        } else if (resp.users) {
          resp.users = resp.users.map((u: User) => {
            u.avatar = baseUrl + u.avatar;
            return u;
          });
        } else if (resp.comment) {
          resp.comment.user.avatar = baseUrl + resp.comment.user.avatar;
        } else if (resp.comments) {
          resp.comments = resp.comments.map((c: Comment) => {
            c.user.avatar = baseUrl + c.user.avatar;
            return c;
          });
        }

        return resp;
      }),
    );
  }
}
