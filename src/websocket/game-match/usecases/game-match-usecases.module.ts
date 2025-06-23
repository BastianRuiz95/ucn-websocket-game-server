import { Module } from '@nestjs/common';

import { SendDataUseCase } from './send-data.usecase';
import { PingMatchUseCase } from './ping-match.usecase';
import { FinishGameUseCase } from './finish-game.usecase';
import { ConnectMatchUseCase } from './connect-match.usecase';

@Module({
  providers: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
    FinishGameUseCase,
  ],
  exports: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
    FinishGameUseCase,
  ],
})
export class GameMatchUseCasesModule {}
