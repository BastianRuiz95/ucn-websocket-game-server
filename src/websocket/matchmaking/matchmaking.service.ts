import { Injectable } from '@nestjs/common';

import { PlayerListService } from '../player-list/player-list.service';

import { Player } from '../common/entities';
import { EPlayerStatus } from '../common/enums';

import { EMatchmakingEvent } from './matchmaking-event.enum';

@Injectable()
export class MatchmakingService {
  constructor(private readonly playerListService: PlayerListService) {}

  sendMatchRequest(senderPlayer: Player, playerId: string) {
    const playerToSend = this.playerListService.getPlayerById(playerId);

    this._checkPlayerStatus(playerToSend);

    playerToSend.status = EPlayerStatus.Busy;
    playerToSend.sendEvent(EMatchmakingEvent.MatchRequestReceived, {
      msg: `Match Request Received from player ${senderPlayer.name}`,
      playerId: senderPlayer.id,
    });

    return {
      msg: `Match request sended to player ${playerToSend.name}`,
    };
  }

  private _checkPlayerStatus(player: Player) {
    const playerStatus = player.status;
    if (playerStatus === EPlayerStatus.Busy) {
      // throw new Error(Player is Busy with another Request. Try again later)
    }

    if (playerStatus === EPlayerStatus.InMatch) {
      // throw new Error(Player is in another match. Wait until this match ends)
    }
  }
}
