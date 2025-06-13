import { Module } from '@nestjs/common';

import { GameMatchService } from './game-match.service';
import { GameMatchEvents } from './game-match.events';

@Module({
  providers: [GameMatchService, GameMatchEvents],
  exports: [GameMatchService, GameMatchEvents],
})
export class GameMatchModule {}
