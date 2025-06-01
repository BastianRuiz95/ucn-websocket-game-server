import { WebSocket } from "ws";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";

import { SocketService } from "../services/socket.service";

import { WS_PORT } from "../constants";
import { EWsMatchmakingEvent, EWsMatchmakingResponse, EWsPlayerStatus } from "../enums";
import { PlayerSocket } from "../interfaces";

@WebSocketGateway(WS_PORT)
export class MatchmakingGateway {
  constructor(private readonly socketService: SocketService) {}

  @SubscribeMessage(EWsMatchmakingEvent.SendMatchRequest)
  sendMatchRequest(
    @MessageBody() body: any,
    @ConnectedSocket() client: WebSocket
  ): WsResponse {
    const player = this.socketService.getPlayerById(body.id)

    if (player?.status == EWsPlayerStatus.Available) {
      this.socketService.sendEventToPlayer(
        player.id,
        this._buildEventResponse(
          player.id,
          EWsMatchmakingResponse.MatchRequestReceived,
          `Match Request Received from player ${player.id}`
        )
      );
    }

    const {event, msg} = this._getEventResponse(player)
    return this._buildEventResponse(player.id, event, msg);
  }

  private _getEventResponse(player: PlayerSocket) {
    const {Busy, Available, InMatch} = EWsPlayerStatus;
    const { PlayerBusy, PlayerInMatch, PlayerDisconnected, MatchRequestSended } = EWsMatchmakingResponse;

    const getter = {
      [Busy]: { event: PlayerBusy, msg: `Player ${player.id} busy. Try again later.` },
      [InMatch]: { event: PlayerInMatch, msg: `Player ${player.id} is in match. Try again later.` },
      [Available]: { event: MatchRequestSended, msg: `Match request sended to player ${player.id}` },
      'default': { event: PlayerDisconnected, msg: `Player is not connected` },
    }

    return getter[player?.status || 'default'];
  }
  
  private _buildEventResponse(playerId: string, event: EWsMatchmakingResponse, msg: string): WsResponse {
    return {
      event,
      data: { playerId, msg },
    }
  }
}