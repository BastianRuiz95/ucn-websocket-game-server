import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

import { Player } from '../common/entities';
import { ConnectedPlayer } from '../common/decorators';

import { EMatchmakingEvent } from './matchmaking-event.enum';
import { MatchmakingService } from './matchmaking.service';

import { Player } from '../player/player';
import { SendMatchRequestDto } from './dtos';
import { EMatchmakingEvent } from './matchmaking-event.enum';
import { ConnectedPlayer } from '../config/connected-player.decorator';

@WebSocketGateway()
export class MatchmakingGateway {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @SubscribeMessage(EMatchmakingEvent.SendMatchRequest)
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
}
