import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerBaseConfig, SwaggerDocument, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';

async function bootstrap(): Promise<void> {
  const config: ConfigService = new ConfigService();
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();
  const swagger_url: string = config.get('swagger_url');
  const port: string = config.get('port');
  const host: string = config.get('host');
  if (swagger_url) {
    const options: SwaggerBaseConfig = new DocumentBuilder()
      .setTitle('Api documentation')
      .addBearerAuth('Authorization', 'header', 'apiKey')
      .setVersion('1.0')
      .setSchemes(config.get('schemes') as 'http' | 'https' )
      .build();
    const document: SwaggerDocument = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swagger_url, app, document);

  }
  await app.listen(port, host, () => {
    console.log(`Server is running http://${host}:${port}/`);
    if (swagger_url) {
      console.log(`Swagger is running http://${host}:${port}/${swagger_url}`);
    }
  });
}

bootstrap();
