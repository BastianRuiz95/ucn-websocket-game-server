import { Provider } from '@nestjs/common';

import { SCORE_REPOSITORY } from '../../domain/repositories';
import { ScoreRepositoryImp } from './score.repository';

export * from './score.repository';

export const REPOSITORIES: Provider[] = [
  { provide: SCORE_REPOSITORY, useClass: ScoreRepositoryImp },
];
