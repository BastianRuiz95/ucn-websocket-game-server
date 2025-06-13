import { Module } from '@nestjs/common';

import { LobbyModule } from './lobby/lobby.module';
import { PlayerModule } from './player/player.module';
import { PlayerListModule } from './player-list/player-list.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';

import { MainLobbyGateway } from './main-lobby.gateway';
import { GameMatchModule } from './game-match/game-match.module';

@Module({
  imports: [
    PlayerModule,
    PlayerListModule,
    LobbyModule,
    MatchmakingModule,
    GameMatchModule,
  ],
  providers: [MainLobbyGateway],
})
export class WebsocketModule {}
