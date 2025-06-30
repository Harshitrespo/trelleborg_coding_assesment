import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Inventory Management')
    .setDescription('API Doc For Inventory Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api', app, () =>
    SwaggerModule.createDocument(app, config),
  );

  app.enableShutdownHooks();
  app.enableCors({ origin: '*' });
  await app.listen(3000);
}
bootstrap();
