import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

import { LobbyService } from './lobby.service';

import { Player } from '../player/player';
import { ELobbyEvent } from './lobby-event.enum';
import { ConnectedPlayer } from '../config/connected-player.decorator';
import { SendPrivateMessageDto, SendPublicMessageDto } from './dtos';

@WebSocketGateway()
export class LobbyGateway {
  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage(ELobbyEvent.OnlinePlayers)
  getConnectedPlayers(): WsResponse {
    const data = this.lobbyService.getOnlinePlayers();

    return { event: ELobbyEvent.OnlinePlayers, data };
  }

  @SubscribeMessage(ELobbyEvent.SendPrivateMessage)
  sendPrivateMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPrivateMessageDto,
  ): WsResponse {
    const data = this.lobbyService.sendPrivateMessage(
      player,
      body.id,
      body.message,
    );

    return { event: ELobbyEvent.SendPrivateMessage, data };
  }

  @SubscribeMessage(ELobbyEvent.SendPublicMessage)
  sendPublicMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPublicMessageDto,
  ): WsResponse {
    const data = this.lobbyService.sendPublicMessage(player, body.message);

    return { event: ELobbyEvent.SendPublicMessage, data };
  }
}
