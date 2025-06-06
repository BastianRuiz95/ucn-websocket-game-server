import { WebSocket } from 'ws';
import { WsResponse } from '@nestjs/websockets';

import { EPlayerStatus } from '../enums';
import { PlayerPresenter } from '../presenters';

export class Player {
  constructor(
    private readonly id: string,
    private readonly socketClient: WebSocket,
    private name: string,
    private status: EPlayerStatus,
  ) {
    this.name = name;
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

  sendEvent<T = object>(event: string, data: T) {
    const message = this._buildResponseEvent(event, data);
    this.socketClient.send(message);
  }

  private _buildResponseEvent<T = object>(event: string, data: T): string {
    const response: WsResponse = { event, data };
    return JSON.stringify(response);
  }
}
