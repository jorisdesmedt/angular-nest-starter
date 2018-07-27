import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({
      passReqToCallback: false,
    });
  }

  async validate(
    username: string,
    password: string,
    done: (Error, any) => void,
  ) {
    const user = await this.authService.validateUserWithUsernamePassword(
      username,
      password,
    );
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
