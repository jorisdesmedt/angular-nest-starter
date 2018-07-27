import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { User } from '../../user/user/user';
import { Request } from 'express';
import { AuthenticationService } from '../authentication.service';

class PassportRefreshStrategy extends Strategy {
  name = 'refresh';
  accessTokenField: string;
  refreshTokenField: string;
  verify: VerifyFunction;

  constructor(options: RefreshStrategyOptions, verify: VerifyFunction);
  constructor(verify: VerifyFunction);
  constructor(optionsOrVerify: (RefreshStrategyOptions | VerifyFunction), verify?: VerifyFunction){
    super();
    if (typeof optionsOrVerify === 'function') {
      this.accessTokenField = 'access_token';
      this.refreshTokenField = 'refresh_token';
      this.verify = optionsOrVerify;
    } else {
      this.accessTokenField = optionsOrVerify.accessTokenField || 'access_token';
      this.refreshTokenField = optionsOrVerify.refreshTokenField || 'refresh_token';
      this.verify = verify;
    }
  }

  authenticate(req: Request, options?: any) {
    const verified = (err: Error, user: User, info: any) => {
      if (err) { return this.error(err); }
      if (!user) { return this.fail(info); }

      this.success(user, info);
    };

    const accessToken = req.body[this.accessTokenField];
    const refreshToken = req.body[this.refreshTokenField];
    this.verify(accessToken, refreshToken, verified);
  }
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(PassportRefreshStrategy) {

  constructor(private auth: AuthenticationService) {
    super({
      accessTokenField: 'access_token',
      refreshTokenField: 'refresh_token',
    });
  }

  async validate(accessToken: string, refreshToken: string, done: (err: Error, user: any) => void) {
    const user = await this.auth.validateUserWithRefreshToken(refreshToken, accessToken);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}

export interface RefreshStrategyOptions {
  accessTokenField?: string;
  refreshTokenField?: string;
}

export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    done: (error: any, user?: any, info?: any) => void,
  ) => void;
