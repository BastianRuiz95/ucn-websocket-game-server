import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

import { Player } from '../common/entities';
import { ConnectedPlayer } from '../common/decorators';

import { EPlayerEvent } from './player-event.enum';
import { ChangeUserNameDto } from './dtos';

@WebSocketGateway()
export class PlayerGateway {
  @SubscribeMessage(EPlayerEvent.ChangeName)
  changeUserName(
    @ConnectedPlayer() player: Player,
    @MessageBody() data: ChangeUserNameDto,
  ): WsResponse {
    player.setName(data.name);
    return {
      event: EPlayerEvent.ChangeName,
      data: {
        msg: 'Name changed',
        name: data.name,
      },
    };
  }

  @SubscribeMessage(EPlayerEvent.PlayerData)
  getPlayerData(@ConnectedPlayer() player: Player): WsResponse {
    return {
      event: EPlayerEvent.PlayerData,
      data: player.getPlayerData(),
    };
  }
}
