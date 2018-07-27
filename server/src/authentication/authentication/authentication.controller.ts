import {
  Controller,
  UseGuards,
  Request,
  Post,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { decode } from 'jsonwebtoken';
import { ConfigService } from '../../common/config.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private config: ConfigService,
  ) {}

  @Post('token')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    const expiresIn = this.config.authentication.accessToken.expiryTime;
    const access_token = await this.authService.generateToken(req.user);
    return {
      access_token,
      refresh_token: await this.authService.generateRefreshToken(req.user.id),
      token_type: 'bearer',
      expires_in: expiresIn,
    };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Request() req) {
    const expiresIn = this.config.authentication.accessToken.expiryTime;
    const access_token = await this.authService.generateToken(req.user);
    return {
      access_token,
      refresh_token: await this.authService.generateRefreshToken(req.user.id),
      token_type: 'bearer',
      expires_in: expiresIn,
    };
  }
}

interface RefreshTokenDTO {
  access_token: string;
  refresh_token: string;
}
