import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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
      msg: `Match Request Received from player ${senderPlayer.name}`,
      playerId: senderPlayer.id,
    });

    return {
      msg: `Match request sended to player "${playerToSend.name}"`,
      matchId: match.id,
    };
  }

  private _checkPlayerStatus(player: Player) {
    const playerStatus = player.status;
    if (playerStatus === EPlayerStatus.Busy) {
      throw new WsGameException(
        `Player "${player.name}" is busy. Try again later.`,
        { playerId: player.id, playerName: player.name },
      );
    }

    if (playerStatus === EPlayerStatus.InMatch) {
      throw new WsGameException(
        `Player "${player.name}" is in another match. Wait until this match ends.`,
        { playerId: player.id, playerName: player.name },
      );
    }
  }

  private _setMatch(playerOne: Player, playerTwo: Player): Match {
    const match = new Match({
      id: uuidv4(),
      playerOne,
      playerTwo,
      status: EMatchStatus.Requested,
    });

    playerOne.status = playerTwo.status = EPlayerStatus.Busy;
    playerOne.match = playerTwo.match = match;

    return match;
  }
}
