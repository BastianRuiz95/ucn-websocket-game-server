import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ScoreEntity } from '../entities/score.entity';

import { Score } from '../../domain/models';
import { ScoreRepository } from '../../domain/repositories';
import { AddGameScoreParams } from '../../domain/repositories/params';

@Injectable()
export class ScoreRepositoryImp implements ScoreRepository {
  constructor(
    @InjectRepository(ScoreEntity)
    private readonly scoreRepository: Repository<ScoreEntity>,
  ) {}

  getScore(id: number): Promise<Score> {
    return this.scoreRepository.findOne({ where: { id } });
  }

  getAllScores(): Promise<Score[]> {
    return this.scoreRepository.find();
  }

  getScoresByGame(gameId: string): Promise<Score[]> {
    return this.scoreRepository.find({
      where: { game: { id: gameId } },
      relations: { game: true },
    });
  }

  async addGameScore(params: AddGameScoreParams): Promise<Score> {
    const score = this.scoreRepository.create({
      playerName: params.playerName,
      score: params.score,
      game: { id: params.gameId },
    });
    await this.scoreRepository.insert(score);
    return score;
  }

  async deleteGameScores(gameId: string): Promise<void> {
    await this.scoreRepository.delete({ game: { id: gameId } });
  }

  async deleteAllScores(): Promise<void> {
    await this.scoreRepository.delete({});
  }
}
