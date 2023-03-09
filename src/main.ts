import { NestFactory } from '@nestjs/core';
import { AppModuleAli } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModuleAli);
  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
