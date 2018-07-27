import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/user/user';
import { v4 as uuid } from 'uuid';
import { decode, sign } from 'jsonwebtoken';
import { ConfigService } from '../common/config.service';
import { RedisService } from '../common/redis.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async validateUserWithToken(payload: JwtPayload): Promise<User> {
    return await this.userService.findOneById(payload.id);
  }

  async validateUserWithUsernamePassword(
    username: string,
    password: string,
  ): Promise<User> {
    return await this.userService.findByUsernameAndPassword(username, password);
  }

  async validateUserWithRefreshToken(refreshToken: string, accessToken: string): Promise<User> {
    const tokenInfo = await this.redis.getObject<RefreshTokenInfo>(`refresh-${refreshToken}`);
    if (tokenInfo) {
      const decodedToken: JwtPayload = decode(accessToken) as any;
      if (tokenInfo.userId === decodedToken.id) {
        await this.redis.delete(`refresh-${refreshToken}`);
        return await this.userService.findOneById(tokenInfo.userId);
      }
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    const expiresIn = this.config.authentication.accessToken.expiryTime;
    return sign(user.toJwtPayload(), 'secret', { expiresIn });
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = uuid();
    const tokenInfo: RefreshTokenInfo = { userId };
    await this.redis.set(`refresh-${refreshToken}`, tokenInfo, this.config.authentication.refreshToken.expiryTime / 1000);
    return refreshToken;
  }
}

interface RefreshTokenInfo {
  userId: number;
}
