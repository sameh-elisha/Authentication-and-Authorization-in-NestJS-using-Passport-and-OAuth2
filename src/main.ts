import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NormalizeErrorFilter } from '../common/filters/normalize-error.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js local dev
      // 'https://your-frontend-domain.com', // production domain
    ],
    credentials: true, // allow cookies / auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('API documentation for User Service')
    .setVersion('1.0')
    .addBearerAuth()

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Error filter
  app.useGlobalFilters(new NormalizeErrorFilter());

  // ✅ Start the server
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  const appUrl = await app.getUrl();
  console.log(`🚀 Server running at: ${appUrl}`);
  console.log(`📘 Swagger Docs available at: ${appUrl}/api`);
}

bootstrap();
