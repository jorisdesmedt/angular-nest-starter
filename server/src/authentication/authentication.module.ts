import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthenticationController } from './authentication/authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [UserModule],
  providers: [AuthenticationService, JwtStrategy, LocalStrategy, RefreshStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
