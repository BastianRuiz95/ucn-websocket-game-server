import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';
import { GameResponse } from '../config/game-response.type';

import { ChangeUserNameDto } from './dtos';

@Injectable()
export class PlayerEvents {
  changeUserName(player: Player, data: ChangeUserNameDto): GameResponse {
    player.name = data.name;
    return {
      msg: 'Name changed',
      data: { name: player.name },
    };
  }

  getPlayerData(player: Player): GameResponse {
    return {
      msg: 'Player list obtained',
      data: player.getPlayerData(),
    };
  }
}
