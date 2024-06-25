import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from './src/config/config.service';
import { ConfigModule } from './src/config/config.module';

export default (async () => {
  const app = await NestFactory.create(ConfigModule, {
    logger: false,
  });

  const config = app.get(ConfigService);

  return new DataSource({
    type: 'postgres',
    url: config.getDatabaseUrl(),
    entities: ['src/database/entities/*.entity{.js,.ts}'],
    migrations: ['src/database/migrations/*{.js,.ts}'],
    synchronize: false,
  });
})();
