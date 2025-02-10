import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // Ajout du middleware cookie-parser
  app.use(cookieParser());

  // Initialisation de Passport
  app.use(passport.initialize());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
