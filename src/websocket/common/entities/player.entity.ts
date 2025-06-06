import { WebSocket } from 'ws';
import { WsResponse } from '@nestjs/websockets';

import { Match } from './match.entity';
import { EPlayerStatus } from '../enums';
import { PlayerPresenter } from '../presenters';

export class Player {
  private match: Match;

  constructor(
    private readonly id: string,
    private readonly socketClient: WebSocket,
    private name: string,
    private status: EPlayerStatus,
  ) {
    this.name = name;
    this.match = null;
  }

  getId(): string {
    return this.id;
  }

  getSocketClient(): WebSocket {
    return this.socketClient;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setStatus(status: EPlayerStatus) {
    this.status = status;
  }

  getStatus(): EPlayerStatus {
    return this.status;
  }

  getPlayerData(): PlayerPresenter {
    return { id: this.id, name: this.name, status: this.status };
  }

  getMatch() {
    return this.match;
  }

  setMatch(match: Match) {
    this.match = match;
  }

  sendEvent<T = object>(event: string, data: T) {
    const message = this._buildResponseEvent(event, data);
    this.socketClient.send(message);
  }

  private _buildResponseEvent<T = object>(event: string, data: T): string {
    const response: WsResponse = { event, data };
    return JSON.stringify(response);
  }
}
