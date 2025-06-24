import { Module } from '@nestjs/common';

import { SendDataUseCase } from './send-data.usecase';
import { QuitMatchUseCase } from './quit-match.usecase';
import { PingMatchUseCase } from './ping-match.usecase';
import { FinishGameUseCase } from './finish-game.usecase';
import { ConnectMatchUseCase } from './connect-match.usecase';

@Module({
  providers: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
    FinishGameUseCase,
    QuitMatchUseCase,
  ],
  exports: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
    FinishGameUseCase,
    QuitMatchUseCase,
  ],
})
export class GameMatchUseCasesModule {}
