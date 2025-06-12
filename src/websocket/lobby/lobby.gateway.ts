import { MessageBody, WebSocketGateway } from '@nestjs/websockets';

import { GameResponse } from '../config/game-response.type';

import { LobbyService } from './lobby.service';

import { Player } from '../common/entities';
import { ConnectedPlayer, WsEventListener } from '../common/decorators';

import { ELobbyEvent } from './lobby-event.enum';
import { SendPrivateMessageDto, SendPublicMessageDto } from './dtos';

@WebSocketGateway()
export class LobbyGateway {
  constructor(private readonly lobbyService: LobbyService) {}

  @WsEventListener(ELobbyEvent.OnlinePlayers)
  getConnectedPlayers(): GameResponse {
    return this.lobbyService.getOnlinePlayers();
  }

  @WsEventListener(ELobbyEvent.SendPrivateMessage)
  sendPrivateMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPrivateMessageDto,
  ): GameResponse {
    return this.lobbyService.sendPrivateMessage(
      player,
      body.playerId,
      body.message,
    );
  }

  @WsEventListener(ELobbyEvent.SendPublicMessage)
  sendPublicMessage(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendPublicMessageDto,
  ): GameResponse {
    return this.lobbyService.sendPublicMessage(player, body.message);
  }
}
