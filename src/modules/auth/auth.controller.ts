import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

/**
 * AuthController prend en charge les routes liées à l'authentification.
 * Il utilise le AuthService pour effectuer des opérations d'authentification et applique des Guards pour l'authentification.
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile() {
    return {
      message: 'page de profil',
    };
  }
}
