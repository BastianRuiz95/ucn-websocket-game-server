import { Injectable } from '@nestjs/common';

import { WsGameException } from '../config/ws-game.exception';
import { PlayerListService } from '../player-list/player-list.service';

import { Match, Player } from '../common/entities';
import { EMatchStatus, EPlayerStatus } from '../common/enums';

import { EMatchmakingEvent } from './matchmaking-event.enum';

@Injectable()
export class MatchmakingService {
  constructor(private readonly playerListService: PlayerListService) {}

  sendMatchRequest(senderPlayer: Player, playerId: string) {
    const playerToSend = this.playerListService.getPlayerById(playerId);

    this._checkPlayerStatus(playerToSend);

    const match = this._setMatch(senderPlayer, playerToSend);
    playerToSend.sendEvent(EMatchmakingEvent.MatchRequestReceived, {
      msg: `Match Request Received from player ${senderPlayer.getName()}`,
      playerId: senderPlayer.getId(),
    });

    return {
      msg: `Match request sended to player "${playerToSend.getName()}"`,
      matchId: match.getId(),
    };
  }

  private _checkPlayerStatus(player: Player) {
    const playerStatus = player.getStatus();
    if (playerStatus === EPlayerStatus.Busy) {
      throw new WsGameException(
        `Player "${player.getName()}" is busy. Try again later.`,
        { playerId: player.getId(), playerName: player.getName() },
      );
    }

    if (playerStatus === EPlayerStatus.InMatch) {
      throw new WsGameException(
        `Player "${player.getName()}" is in another match. Wait until this match ends.`,
        { playerId: player.getId(), playerName: player.getName() },
      );
    }
  }

  private _setMatch(playerOne: Player, playerTwo: Player): Match {
    const match = new Match(EMatchStatus.Requested, playerOne, playerTwo);

    playerOne.setStatus(EPlayerStatus.Busy);
    playerOne.setMatch(match);
    playerTwo.setStatus(EPlayerStatus.Busy);
    playerTwo.setMatch(match);

    return match;
  }
}
