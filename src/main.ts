import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { useContainer } from 'class-validator';

let serviceAccount;

try {
  // tslint:disable-next-line:no-var-requires
  serviceAccount = require('../firebase/serviceAccountKey.json');
} catch {
  serviceAccount = null;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use('/img', express.static('img'));
  app.use(express.json({limit: '10mb'}));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if(serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://dwec2019.firebaseio.com',
    });
  }

  await app.listen(3000);
}
bootstrap();
