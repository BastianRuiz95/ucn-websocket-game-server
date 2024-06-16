import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Provider } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { getTypeOrmModuleOptions } from './typeorm.config';

import * as ENTITIES from './entities';
import { SessionRepositoryImp } from './repositories';
import { SESSION_REPOSITORY } from '../domain/repositories';

const REPOSITORIES: Provider[] = [
  { provide: SESSION_REPOSITORY, useClass: SessionRepositoryImp },
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
    TypeOrmModule.forFeature(Object.values(ENTITIES)),
  ],
  providers: [...REPOSITORIES],
  exports: [...REPOSITORIES],
})
export class DatabaseModule {}
