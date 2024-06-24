import { Provider } from '@nestjs/common';

import {
  SCORE_REPOSITORY,
  SESSION_REPOSITORY,
} from '../../domain/repositories';
import { ScoreRepositoryImp } from './score.repository';
import { SessionRepositoryImp } from './session.repository';

export * from './score.repository';
export * from './session.repository';

export const REPOSITORIES: Provider[] = [
  { provide: SESSION_REPOSITORY, useClass: SessionRepositoryImp },
  { provide: SCORE_REPOSITORY, useClass: ScoreRepositoryImp },
];
