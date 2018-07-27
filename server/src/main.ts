import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { Express } from 'express';
import * as fs from 'fs';
import { Stats } from 'fs';

async function bootstrap() {
  const enableSSR = await isClientBundlesExisting();
  const app = express();
  const server = await NestFactory.create(AppModule, app);

  if (enableSSR) {
    await setUpServerSideRendering(app);
  }

  await server.listen(3000);
}

async function setUpServerSideRendering(app: Express) {
  const client = await import('../../dist/client-server/main');
  const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = client;

  app.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [provideModuleMap(LAZY_MODULE_MAP)],
    }),
  );

  app.set('view engine', 'html');
  app.set('views', './dist/client/');
  app.get('*.*', express.static('./dist/client/'));
}

async function isClientBundlesExisting(): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    fs.stat('./dist/client', (err, clientStats: Stats) => {
      if (err) {
        resolve(false);
      } else if (clientStats && clientStats.isDirectory()) {
        fs.stat('./dist/client-server/main.js', (err2, ssrStats: Stats) => {
          if (err2) {
            resolve(false);
          }
          resolve(ssrStats && ssrStats.isFile());
        });
      } else {
        resolve(false);
      }
    });
  });
}
bootstrap();
