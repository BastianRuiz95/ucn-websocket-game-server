import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Player } from '../common/entities';
import { EPlayerStatus } from '../common/enums';

@Injectable()
export class PlayerService {
  createPlayer(socketClient: WebSocket, name: string): Player {
    return new Player({
      id: uuidv4(),
      socketClient,
      name,
      status: EPlayerStatus.Available,
    });
  }
}
