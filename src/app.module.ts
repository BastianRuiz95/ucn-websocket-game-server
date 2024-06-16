import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [ConfigModule, WebsocketModule],
})
export class AppModule {}
