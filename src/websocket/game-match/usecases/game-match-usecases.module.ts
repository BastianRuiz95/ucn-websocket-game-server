import { Module } from '@nestjs/common';

import { SendDataUseCase } from './send-data.usecase';
import { PingMatchUseCase } from './ping-match.usecase';
import { ConnectMatchUseCase } from './connect-match.usecase';

@Module({
  providers: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
  ],
  exports: [
    ConnectMatchUseCase,
    PingMatchUseCase,
    SendDataUseCase,
  ],
})
export class GameMatchUseCasesModule {}
