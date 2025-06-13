import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

import { ConnectMatchUseCase } from './usecases';

@Injectable()
export class GameMatchService {
  constructor(private readonly connectMatchUseCase: ConnectMatchUseCase) {}

  connectMatch(player: Player) {
    return this.connectMatchUseCase.exec(player);
  }

  pingMatch(player: Player) {}

  sendData(player: Player) {}

  finishGame(player: Player) {}

  sendRematchRequest(player: Player) {}

  quitMatch(player: Player) {}
}
