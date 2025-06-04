import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { ConnectedPlayer } from '../config/connected-player.decorator';

import { Player } from './player';
import { ChangeUserNameDto } from './dtos';
import { EPlayerEvent } from './player-event.enum';

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
