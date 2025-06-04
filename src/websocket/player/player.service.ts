import { WebSocket } from 'ws';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Player } from './player';
import { EPlayerStatus } from './enums';

@Injectable()
export class PlayerService {
  createPlayer(socketClient: WebSocket, name: string) {
    const newPlayer: Player = new Player(
      uuidv4(),
      socketClient,
      name,
      EPlayerStatus.Available,
    );

    return newPlayer;
  }

  changeUserName(player: Player, name: string) {
    player.setName(name);
    return player.getPlayerData();
  }
}
