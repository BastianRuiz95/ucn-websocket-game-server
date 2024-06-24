import { Module } from '@nestjs/common';

import { ScoreModule } from '../modules/score/score.module';

import { ScoreController } from './score.controller';

@Module({
  imports: [ScoreModule],
  controllers: [ScoreController],
})
export class HttpModule {}
