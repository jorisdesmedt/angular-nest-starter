import { DynamicModule, Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { RouterModule, Routes } from 'nest-router';
import { ApiModule } from './api/api.module';

const routes: Routes = [
  {
    path: '/api',
    children: [ApiModule],
  },
];

@Module({
  controllers: [],
  providers: [],
})
export class AppModule {
  static forRoot(enableSSR): DynamicModule {
    return {
      module: AppModule,
      imports: enableSSR
        ? [RouterModule.forRoutes(routes), ClientModule, ApiModule]
        : [RouterModule.forRoutes(routes), ApiModule],
    };
  }
}
