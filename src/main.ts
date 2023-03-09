import { NestFactory } from '@nestjs/core';
import { AppModuleAli } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModuleAli);
  await app.listen(3000);
}
bootstrap();
