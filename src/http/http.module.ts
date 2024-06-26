import { Module } from '@nestjs/common';

import { ScoreModule } from '../modules/score/score.module';

import { ScoreController } from './score.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, ScoreModule],
  controllers: [ScoreController],
})
export class HttpModule {}
