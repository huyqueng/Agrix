import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<string>('PORT') || 2000);
  console.log(configService.get<string>('PORT'), error)
} 
bootstrap();
  