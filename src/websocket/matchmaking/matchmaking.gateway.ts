import { MessageBody, WebSocketGateway } from '@nestjs/websockets';

import { GameResponse } from '../config/game-response.type';

import { Player } from '../common/entities';
import { ConnectedPlayer, WsEventListener } from '../common/decorators';

import { EMatchmakingEvent } from './matchmaking-event.enum';
import { MatchmakingService } from './matchmaking.service';
import { SendMatchRequestDto } from './dtos';

@WebSocketGateway()
export class MatchmakingGateway {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @WsEventListener(EMatchmakingEvent.SendMatchRequest)
  sendMatchRequest(
    @ConnectedPlayer() player: Player,
    @MessageBody() body: SendMatchRequestDto,
  ): GameResponse {
    return this.matchmakingService.sendMatchRequest(player, body.playerId);
  }

  @WsEventListener(EMatchmakingEvent.CancelMatchRequest)
  cancelMatchRequest(@ConnectedPlayer() player: Player): GameResponse {
    return this.matchmakingService.cancelMatchRequest(player);
  }

  @WsEventListener(EMatchmakingEvent.AcceptMatch)
  acceptMatchRequest(@ConnectedPlayer() player: Player): GameResponse {
    return this.matchmakingService.acceptMatchRequest(player);
  }

  @WsEventListener(EMatchmakingEvent.RejectMatch)
  rejectMatchRequest(@ConnectedPlayer() player: Player): GameResponse {
    return this.matchmakingService.rejectMatchRequest(player);
  }
}
