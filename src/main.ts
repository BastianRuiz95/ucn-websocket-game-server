import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from './infrastructure/config/config.service';
import { CustomWsAdapter } from './websocket/config/custom-ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(
    new CustomWsAdapter(app, configService.getWsPort() || 4010),
  );

  await app.listen(configService.getAppPort() || 3000);
}
bootstrap();
