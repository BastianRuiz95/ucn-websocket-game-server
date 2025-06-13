import { Module } from '@nestjs/common';

import { ConnectMatchUseCase } from './connect-match.usecase';

@Module({
  providers: [ConnectMatchUseCase],
  exports: [ConnectMatchUseCase],
})
export class GameMatchUseCasesModule {}
