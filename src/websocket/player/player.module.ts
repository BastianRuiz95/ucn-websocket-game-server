import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerEvents } from './player.events';

@Module({
  providers: [PlayerService, PlayerEvents],
  exports: [PlayerService, PlayerEvents],
})
export class PlayerModule {}
