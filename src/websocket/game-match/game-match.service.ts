import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

import {
  ConnectMatchUseCase,
  PingMatchUseCase,
} from './usecases';

@Injectable()
export class GameMatchService {
  constructor(
    private readonly pingMatchUseCase: PingMatchUseCase,
    private readonly connectMatchUseCase: ConnectMatchUseCase,
  ) {}

  connectMatch(player: Player) {
    return this.connectMatchUseCase.exec(player);
  }

  pingMatch(player: Player) {
    return this.pingMatchUseCase.exec(player);
  }

  sendData(player: Player) {}

  finishGame(player: Player) {}

  sendRematchRequest(player: Player) {}

  quitMatch(player: Player) {}
}
