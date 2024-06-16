import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
