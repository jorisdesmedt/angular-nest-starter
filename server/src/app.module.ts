import { DynamicModule, Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { RouterModule, Routes } from 'nest-router';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommonModule } from './common/common.module';

const routes: Routes = [
  {
    path: '/api',
    children: [ApiModule, AuthenticationModule],
  },
];

@Module({
  controllers: [],
  providers: [],
  imports: [
    RouterModule.forRoutes(routes),
    AuthenticationModule,
    ClientModule,
    ApiModule,
    CommonModule,
  ],
})
export class AppModule {}
