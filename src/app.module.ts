import { Module } from '@nestjs/common';

import { HttpModule } from './http/http.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [ConfigModule, DatabaseModule, HttpModule, WebsocketModule],
})
export class AppModule {}
