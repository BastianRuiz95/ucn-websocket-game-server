import { Module } from '@nestjs/common';

import { PlayerListModule } from '../player-list/player-list.module';

import { LobbyService } from './lobby.service';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [PlayerListModule],
  providers: [LobbyService, LobbyGateway],
})
export class LobbyModule {}
