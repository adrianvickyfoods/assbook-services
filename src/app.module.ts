import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'arturober.com',
      port: 3306,
      username: 'example',
      password: 'example',
      database: 'project1',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
      // debug: true,
    }),
    PostsModule,
    UsersModule,
    CommonsModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
