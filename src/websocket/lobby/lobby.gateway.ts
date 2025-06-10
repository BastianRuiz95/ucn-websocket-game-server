import { MessageBody, WebSocketGateway, WsResponse } from '@nestjs/websockets';

import { LobbyService } from './lobby.service';

import { Player } from '../common/entities';
import { ConnectedPlayer, WsEventListener } from '../common/decorators';

import { ELobbyEvent } from './lobby-event.enum';
import { SendPrivateMessageDto, SendPublicMessageDto } from './dtos';

@WebSocketGateway()
export class LobbyGateway {
  constructor(private readonly lobbyService: LobbyService) {}

  @WsEventListener(ELobbyEvent.OnlinePlayers)
  getConnectedPlayers(): WsResponse {
    const data = this.lobbyService.getOnlinePlayers();

    return { event: ELobbyEvent.OnlinePlayers, data };
  }

  @WsEventListener(ELobbyEvent.SendPrivateMessage)
  sendPrivateMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPrivateMessageDto,
  ): WsResponse {
    const data = this.lobbyService.sendPrivateMessage(
      player,
      body.playerId,
      body.message,
    );

    return { event: ELobbyEvent.SendPrivateMessage, data };
  }

  @WsEventListener(ELobbyEvent.SendPublicMessage)
  sendPublicMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPublicMessageDto,
  ): WsResponse {
    const data = this.lobbyService.sendPublicMessage(player, body.message);

    return { event: ELobbyEvent.SendPublicMessage, data };
  }
}
