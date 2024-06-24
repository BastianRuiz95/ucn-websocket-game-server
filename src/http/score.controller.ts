import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { ScoreService } from '../modules/score/score.service';
import { AddScoreDto } from './dtos';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':gameId')
  getScoreByGameId(@Param('gameId', ParseUUIDPipe) id: string) {
    return this.scoreService.getScoreByGame(id);
  }

  @Post(':gameId')
  addScore(
    @Param('gameId', ParseUUIDPipe) id: string,
    @Body() body: AddScoreDto,
  ) {
    return this.scoreService.addGameScore({
      gameId: id,
      score: body.score,
      playerName: body.playerName,
    });
  }
}
