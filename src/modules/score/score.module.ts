import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { ScoreService } from './score.service';

@Module({
  imports: [DatabaseModule],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
