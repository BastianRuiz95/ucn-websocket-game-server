import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';

import { PlayerSocket } from '../interfaces';
import { EWsPlayerStatus } from '../enums';

@Injectable()
export class SocketService {
  private _players: PlayerSocket[] = [];

  getPlayers(): PlayerSocket[] {
    return this._players;
  }

  getPlayerById(id: string): PlayerSocket {
    return this._players.find((p) => p.id === id) || null;
  }

  getPlayerBySocket(socket: WebSocket): PlayerSocket {
    return this._players.find((p) => p.socket === socket) || null;
  }

  addPlayer(playerId: string, socket: WebSocket): PlayerSocket {
    const playerSocket: PlayerSocket = {
      socket,
      id: playerId,
      status: EWsPlayerStatus.Available,
    };

    this._players.push(playerSocket);

    return playerSocket;
  }

  removePlayer(id: string): PlayerSocket;
  removePlayer(socket: WebSocket): PlayerSocket;
  removePlayer(idOrSocket: string | WebSocket): PlayerSocket {
    const player: PlayerSocket =
      typeof idOrSocket === 'string'
        ? this.getPlayerById(idOrSocket)
        : this.getPlayerBySocket(idOrSocket);

    if (!player) {
      return null;
    }

    this._players.splice(this._players.indexOf(player), 1);

    return player;
  }

  sendEventToAllPlayers(response: WsResponse): void {
    this._players.forEach((c) => {
      c.socket.send(JSON.stringify(response));
    });
  }

  sendEventToPlayer(id: string, response: WsResponse): void;
  sendEventToPlayer(socket: WebSocket, response: WsResponse): void;
  sendEventToPlayer(
    idOrSocket: string | WebSocket,
    response: WsResponse,
  ): void {
    const player: PlayerSocket =
      typeof idOrSocket === 'string'
        ? this.getPlayerById(idOrSocket)
        : this.getPlayerBySocket(idOrSocket);

    player.socket.send(JSON.stringify(response));
  }
}
