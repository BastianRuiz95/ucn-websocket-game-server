import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SessionEntity } from './session.entity';
import { Session, User } from '../../domain/models';
import { ETableNames, EUserTableColumns } from '../enums';

@Entity({ name: ETableNames.User })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid', { name: EUserTableColumns.Id })
  id: string;

  @Column({ type: 'varchar', name: EUserTableColumns.Name })
  name: string;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: Session[];
}
