import { Module } from '@nestjs/common';

import { PingMatchUseCase } from './ping-match.usecase';
import { ConnectMatchUseCase } from './connect-match.usecase';

@Module({
  providers: [
    ConnectMatchUseCase,
    PingMatchUseCase,
  ],
  exports: [
    ConnectMatchUseCase,
    PingMatchUseCase,
  ],
})
export class GameMatchUseCasesModule {}
