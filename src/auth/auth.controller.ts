import {
  Controller,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Res,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginTokenDto } from './dto/login-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Res() res: Response, @Body() userDto: RegisterUserDto) {
    try {
      const user = await this.authService.registerUser(userDto);
      res.status(HttpStatus.CREATED).send({email: user.email});
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userDto: LoginUserDto) {
    try {
      return await this.authService.login(userDto);
    } catch (e) {
      throw new UnauthorizedException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Email or password incorrect',
        },
      );
    }
  }

  @Post('google')
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginGoogle(@Body() tokenDto: LoginTokenDto) {
    try {
      return await this.authService.loginGoogle(tokenDto);
    } catch (e) {
      throw new UnauthorizedException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Google login failed',
        },
      );
    }
  }

  @Post('facebook')
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginFacebook(@Body() tokenDto: LoginTokenDto) {
    try {
      return await this.authService.loginFacebook(tokenDto);
    } catch (e) {
      throw new UnauthorizedException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Facebook login failed',
        },
      );
    }
  }

  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  validate() {
    // Valida el token
    return { ok: true };
  }
}
