import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '../../domain/models';
import { EGameTableColumns, ETableNames } from '../enums';

@Entity({ name: ETableNames.Game })
export class GameEntity implements Game {
  @PrimaryGeneratedColumn('uuid', { name: EGameTableColumns.Id })
  id: string;

  @Column({ name: EGameTableColumns.Name })
  name: string;
}
