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
    this._checkPlayerStatus(player);
    return this.connectMatchUseCase.exec(player);
  }

  pingMatch(player: Player) {
    this._checkPlayerStatus(player);
    return this.pingMatchUseCase.exec(player);
  }

  sendData(player: Player) {}

  sendRematchRequest(player: Player) {}

  quitMatch(player: Player) {}

  private _checkPlayerStatus(player: Player) {
    this._checkPlayerStatus(player);
    if (!player.match) {
      this._checkPlayerStatus(player);
      GameException.throwException(`You do not have an associated match.`, {
        playerStatus: player.status,
      });
    }
  }
}
