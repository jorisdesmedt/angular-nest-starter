import { Injectable } from '@nestjs/common';
import { get } from 'config';

@Injectable()
export class ConfigService {
  get redis() {
    return {
      password: get<string>('redis.password'),
      host: get<string>('redis.host'),
      port: get<number>('redis.port'),
    };
  }

  get authentication() {
    return {
      accessToken: {
        expiryTime: get<number>('authentication.accessToken.expiryTime'),
      },
      refreshToken: {
        expiryTime: get<number>('authentication.refreshToken.expiryTime'),
      },
    };
  }
}
