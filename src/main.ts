import helmet from 'helmet';
import { WsAdapter } from '@nestjs/platform-ws';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './infrastructure/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  const configService = app.get(ConfigService);
  await app.listen(configService.getAppPort() || 3000);
}
bootstrap();
