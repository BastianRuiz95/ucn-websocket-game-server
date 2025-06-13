import { Module } from '@nestjs/common';

import { PlayerListModule } from '../player-list/player-list.module';

import { MatchmakingService } from './matchmaking.service';
import { MatchmakingEvents } from './matchmaking.events';

@Module({
  imports: [PlayerListModule],
  providers: [MatchmakingService, MatchmakingEvents],
  exports: [MatchmakingService, MatchmakingEvents],
})
export class MatchmakingModule {}
