import { Module } from '@nestjs/common';

import { LobbyModule } from './lobby/lobby.module';
import { PlayerModule } from './player/player.module';
import { PlayerListModule } from './player-list/player-list.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';

import { ConnectionHandlerGateway } from './config/connection-handler.gateway';

@Module({
  imports: [PlayerModule, PlayerListModule, LobbyModule, MatchmakingModule],
  providers: [ConnectionHandlerGateway],
})
export class WebsocketModule {}
