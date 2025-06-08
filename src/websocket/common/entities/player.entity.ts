import { Exclude } from 'class-transformer';
import { WebSocket } from 'ws';
import { WsResponse } from '@nestjs/websockets';

import { EPlayerStatus } from '../enums';

type PlayerPresenter = Omit<
  Player,
  'socketClient' | 'getPlayerData' | 'sendEvent'
>;

export class Player {
  readonly id: string;
  name: string;
  status: EPlayerStatus;

  @Exclude()
  readonly socketClient: WebSocket;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
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
