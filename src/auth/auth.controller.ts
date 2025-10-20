import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginForm } from './dtos/login.user.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import type { Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles/roles.guard';
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: LoginForm })
  async login(@Request() req) {
    return await this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshTokens(req.user.id, req.user.name);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    console.log('Google User', req.user);

    const response = await this.authService.login(req.user.id, req.user.name);

    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // use HTTPS in prod
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userName = response.name
      ? encodeURIComponent(response.name)
      : 'Unknown';

    //  Redirect to frontend without sensitive data
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?userId=${response.userId}&name=${encodeURIComponent(
        userName,
      )}`,
    );
  }

  @Post('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return this.authService.signOut(req.user.id);
  }

  @Roles('ADMIN')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
