import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { Roles } from './decorators/customize';
// import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JWTAuthGuard(reflector) /*new RolesGuard(reflector)*/,
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor()); // format response
  await app.listen(configService.get<string>('PORT') || 2000);
}
bootstrap();
