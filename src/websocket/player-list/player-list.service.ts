import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

@Injectable()
export class PlayerListService {
  private readonly _playerList: Player[] = [];

  addPlayer(player: Player) {
    this._playerList.push(player);
  }

  removePlayer(player: Player) {
    this._playerList.splice(this._playerList.indexOf(player), 1);
  }

  getPlayers(): Player[] {
    return this._playerList;
  }

  getPlayerBySocket(socketClient: WebSocket): Player {
    return (
      this._playerList.find((p) => p.socketClient === socketClient) || null
    );
  }

  getPlayerById(playerId: string): Player {
    return this._playerList.find((p) => p.id === playerId) || null;
  }

  broadcast<T = object>(event: string, data: T, omitPlayerId: string = null) {
    this._playerList.forEach((p) => {
      if (!omitPlayerId || omitPlayerId != p.id) p.sendEvent(event, data);
    });
  }
}
