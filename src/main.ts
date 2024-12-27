import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  const globalPrefix = '/public/api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS for all origins
  app.enableCors({
    origin:'https://www.algorimsoftware.io/',
  });

  await app.listen(8080);
}
bootstrap();
