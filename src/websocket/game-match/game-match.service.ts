import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

import {
  ConnectMatchUseCase,
  PingMatchUseCase,
  SendDataUseCase,
} from './usecases';
import { GameException } from '../config/game.exception';

@Injectable()
export class GameMatchService {
  constructor(
    private readonly sendDataUseCase: SendDataUseCase,
    private readonly pingMatchUseCase: PingMatchUseCase,
    private readonly connectMatchUseCase: ConnectMatchUseCase,
  ) {}

  connectMatch(player: Player) {
    this._checkPlayerStatus(player);
    return this.connectMatchUseCase.exec(player);
  }

  pingMatch(player: Player) {
    this._checkPlayerStatus(player);
    return this.pingMatchUseCase.exec(player);
  }

  sendData(player: Player, data: object) {
    this._checkPlayerStatus(player);
    return this.sendDataUseCase.exec(player, data);
  }

  finishGame(player: Player) {}

  sendRematchRequest(player: Player) {}

  quitMatch(player: Player) {}

  private _checkPlayerStatus(player: Player) {
    if (!player.match) {
      GameException.throwException(`You do not have an associated match.`, {
        playerStatus: player.status,
      });
    }
  }
}
