import { MessageBody, WebSocketGateway, WsResponse } from '@nestjs/websockets';

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
  ): WsResponse {
    const data = this.matchmakingService.sendMatchRequest(
      player,
      body.playerId,
    );

    return { event: EMatchmakingEvent.SendMatchRequest, data };
  }

  @WsEventListener(EMatchmakingEvent.CancelMatchRequest)
  cancelMatchRequest(@ConnectedPlayer() player: Player): WsResponse {
    const data = this.matchmakingService.cancelMatchRequest(player);

    return { event: EMatchmakingEvent.CancelMatchRequest, data };
  }
}
