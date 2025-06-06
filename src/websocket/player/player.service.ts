import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Player } from '../common/entities';
import { EPlayerStatus } from '../common/enums';

@Injectable()
export class PlayerService {
  createPlayer(socketClient: WebSocket, name: string) {
    return new Player(uuidv4(), socketClient, name, EPlayerStatus.Available);
  }

  changeUserName(player: Player, name: string) {
    player.setName(name);
    return player.getPlayerData();
  }
}
