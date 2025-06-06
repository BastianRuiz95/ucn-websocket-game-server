import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Player } from '../common/entities';
import { ConnectedPlayer } from '../common/decorators';

import { Player } from './player';
import { ChangeUserNameDto } from './dtos';
import { EPlayerEvent } from './player-event.enum';
import { ChangeUserNameDto } from './dtos';

@WebSocketGateway()
export class PlayerGateway {
  @SubscribeMessage(EPlayerEvent.ChangeName)
  changeUserName(
    @ConnectedPlayer() player: Player,
    @MessageBody() data: ChangeUserNameDto,
  ) {
    player.setName(data.name);
  }

  @SubscribeMessage(EPlayerEvent.PlayerData)
  getPlayerData(@ConnectedPlayer() player: Player) {
    return player.getPlayerData();
  }
}
