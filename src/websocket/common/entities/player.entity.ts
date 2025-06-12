import { WebSocket } from 'ws';
import { Exclude } from 'class-transformer';

import { Match } from './match.entity';
import { EPlayerStatus } from '../enums';

type PlayerPresenter = Omit<
  Player,
  'socketClient' | 'getPlayerData' | 'sendEvent' | 'match'
>;

export class Player {
  readonly id: string;
  name: string;
  status: EPlayerStatus;
  match: Match;

  @Exclude()
  readonly socketClient: WebSocket;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
  }

  getPlayerData(): PlayerPresenter {
    return { id: this.id, name: this.name, status: this.status };
  }

  sendEvent<T = object>(event: string, msg: string, data: T) {
    this.socketClient.send(JSON.stringify({ event, msg, data }));
  }
}
