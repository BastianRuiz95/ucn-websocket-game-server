import { Module } from '@nestjs/common';
import { SocketService } from './services/socket.service';
import { ConnectionGateway } from './gateways';

@Module({
  providers: [SocketService, ConnectionGateway],
})
export class WebsocketModule {}
