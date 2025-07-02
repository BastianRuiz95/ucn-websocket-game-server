import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';
import { EPlayerStatus } from '../common/enums';

@Injectable()
export class PlayerListService {
  // private readonly _playerList: Player[] = [];
  private readonly _playerList: Record<string, Player> = {};

  addPlayer(player: Player) {
    this._playerList[player.id] = player;
  }

  removePlayer(player: Player) {
    delete this._playerList[player.id];
  }

  getPlayers(): Player[] {
    return Object.keys(this._playerList).map((v) => {
      return (
        this._playerList[v] &&
        this._playerList[v].status !== EPlayerStatus.NoLogin &&
        this._playerList[v].status !== EPlayerStatus.Disconnected &&
        this._playerList[v]
      );
    });
  }

  // TODO: Refactor this to O(1) complex
  getPlayerBySocket(socketClient: WebSocket): Player {
    return Object.keys(this._playerList)
      .map((v) => {
        return this._playerList[v];
      })
      .find((p) => p.socketClient == socketClient);
  }

  getPlayerById(playerId: string): Player {
    return this._playerList[playerId] || null;
  }

  broadcast<T = object>(
    event: string,
    msg: string,
    data: T,
    omitPlayerId: string = null,
  ) {
    this.getPlayers().forEach((p) => {
      if (!omitPlayerId || omitPlayerId != p.id) p.sendEvent(event, msg, data);
    });
  }
}
