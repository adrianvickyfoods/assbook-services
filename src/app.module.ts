import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ImageUrlInterceptor } from './interceptors/image-url.interceptor';
import { ID_GOOGLE } from './google-id';

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
    AuthModule.forRoot({googleId: ID_GOOGLE}),
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ImageUrlInterceptor,
    }
  ],
})
export class AppModule {}
