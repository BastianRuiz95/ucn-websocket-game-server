import { Module } from '@nestjs/common';
import { SocketService } from './services/socket.service';
import { ConnectionGateway, LobbyGateway } from './gateways';

@Module({
  providers: [SocketService, ConnectionGateway, LobbyGateway],
})
export class WebsocketModule {}
