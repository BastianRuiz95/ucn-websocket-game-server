import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

import { WS_PORT } from '../constants';
import { SocketService } from '../services/socket.service';
import { EWsLobbyEvent, EWsLobbyResponse } from '../enums';
import { SendPrivateMessageDto, SendPublicMessageDto } from './dtos';

@WebSocketGateway(WS_PORT)
export class LobbyGateway {
  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage(EWsLobbyEvent.GetConnectedPlayers)
  getConnectedPlayers(): WsResponse {
    const players = this.socketService.getPlayers();

    return {
      event: EWsLobbyEvent.GetConnectedPlayers,
      data: players.map((p) => p.id),
    };
  }

  @SubscribeMessage(EWsLobbyEvent.GetMyId)
  getOwnPlayerId(@ConnectedSocket() client: WebSocket): WsResponse {
    const player = this.socketService.getPlayerBySocket(client);
    return {
      event: EWsLobbyEvent.GetMyId,
      data: {
        id: player.id,
      },
    };
  }

  @SubscribeMessage(EWsLobbyEvent.SendPublicMessage)
  sendPublicMessage(
    @MessageBody() body: SendPublicMessageDto,
    @ConnectedSocket() socket: WebSocket,
  ): WsResponse {
    const player = this.socketService.getPlayerBySocket(socket);

    this.socketService.sendEventToAllPlayers({
      event: EWsLobbyResponse.PublicMessage,
      data: {
        id: player.id,
        msg: body.message,
      },
    });

    return {
      event: EWsLobbyEvent.SendPublicMessage,
      data: 'Message sended',
    };
  }

  @SubscribeMessage(EWsLobbyEvent.SendPrivateMessage)
  sendPrivateMessage(
    @MessageBody() body: SendPrivateMessageDto,
    @ConnectedSocket() socket: WebSocket,
  ): WsResponse {
    const originPlayer = this.socketService.getPlayerBySocket(socket);

    const destPlayer = this.socketService.getPlayerById(body.id);

    this.socketService.sendEventToPlayer(destPlayer.socket, {
      event: EWsLobbyResponse.PrivateMessage,
      data: {
        id: originPlayer.id,
        msg: body.message,
      },
    });

    return {
      event: EWsLobbyEvent.SendPrivateMessage,
      data: 'Message sended',
    };
  }
}
