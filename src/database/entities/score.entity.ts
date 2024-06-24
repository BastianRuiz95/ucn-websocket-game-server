import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Game, Score } from '../../domain/models';
import { EScoreTableColumns, ETableNames } from '../enums';

import { GameEntity } from './game.entity';

@Entity({ name: ETableNames.Score })
export class ScoreEntity implements Score {
  @PrimaryGeneratedColumn({ name: EScoreTableColumns.Id })
  id: number;

  @Column({ name: EScoreTableColumns.PlayerName })
  playerName: string;

  @Column({ name: EScoreTableColumns.Score })
  score: number;

  @OneToMany(() => GameEntity, (game) => game.id)
  game?: Game;
}
