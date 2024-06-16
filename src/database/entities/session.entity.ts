import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { Session, User } from '../../domain/models';
import { ESessionTableColumns, ETableNames } from '../enums';

@Entity({ name: ETableNames.Session })
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn({ name: ESessionTableColumns.Id })
  id: number;

  @Column({ type: 'varchar', name: ESessionTableColumns.Secret, unique: true })
  secret: string;

  @Column({ type: 'timestamp', name: ESessionTableColumns.CreationDate })
  creationDate: Date;

  @Column({ type: 'timestamp', name: ESessionTableColumns.ExpirationDate })
  expirationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: ESessionTableColumns.UserId })
  user?: User;
}
