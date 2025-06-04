import { Module } from '@nestjs/common';

import { PlayerListModule } from '../player-list/player-list.module';

import { MatchmakingService } from './matchmaking.service';
import { MatchmakingGateway } from './matchmaking.gateway';

@Module({
  imports: [PlayerListModule],
  providers: [MatchmakingService, MatchmakingGateway],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
