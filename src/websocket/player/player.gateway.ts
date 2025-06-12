import { MessageBody, WebSocketGateway } from '@nestjs/websockets';

import { GameResponse } from '../config/game-response.type';

import { Player } from '../common/entities';
import { ConnectedPlayer, WsEventListener } from '../common/decorators';

import { EPlayerEvent } from './player-event.enum';
import { ChangeUserNameDto } from './dtos';

@WebSocketGateway()
export class PlayerGateway {
  @WsEventListener(EPlayerEvent.ChangeName)
  changeUserName(
    @ConnectedPlayer() player: Player,
    @MessageBody() data: ChangeUserNameDto,
  ): GameResponse {
    player.name = data.name;
    return {
      msg: 'Name changed',
      data: {
        name: player.name,
      },
    };
  }

  @WsEventListener(EPlayerEvent.PlayerData)
  getPlayerData(@ConnectedPlayer() player: Player): GameResponse {
    return {
      msg: 'Player list obtained',
      data: player.getPlayerData(),
    };
  }
}
