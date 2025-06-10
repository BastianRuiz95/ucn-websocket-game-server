import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { GameException } from '../config/game.exception';
import { PlayerListService } from '../player-list/player-list.service';

import { Match, Player } from '../common/entities';
import { EMatchStatus, EPlayerStatus } from '../common/enums';

import { EMatchmakingEvent } from './matchmaking-event.enum';

@Injectable()
export class MatchmakingService {
  constructor(private readonly playerListService: PlayerListService) {}

  sendMatchRequest(senderPlayer: Player, playerId: string) {
    if (senderPlayer.id === playerId) {
      GameException.throwException(
        `You cannot send a match request to yourself.`,
        { playerId },
      );
    }

    const playerToSend = this.playerListService.getPlayerById(playerId);

    this._checkSenderStatus(senderPlayer);
    this._checkDestintatorStatus(playerToSend);

    const match = this._createMatch(senderPlayer, playerToSend);
    playerToSend.sendEvent(EMatchmakingEvent.MatchRequestReceived, {
      msg: `Match request received from player ${senderPlayer.name}`,
      playerId: senderPlayer.id,
    });

    return {
      msg: `Match request sent to player "${playerToSend.name}".`,
      matchId: match.id,
    };
  }

  private _checkSenderStatus(sender: Player) {
    if (sender.status === EPlayerStatus.Available) {
      return;
    }

    const match = sender.match;
    if (sender.status === EPlayerStatus.InMatch) {
      GameException.throwException(
        `You cannot send match requests because you are already in one.`,
        { matchId: match.id, matchStatus: match.status },
      );
    }

    if (sender.id === match.senderPlayer.id) {
      GameException.throwException(
        `You have already submitted a match request. Wait for it to be approved or rejected, or wait a few seconds.`,
        { matchId: match.id, matchStatus: match.status },
      );
    } else {
      GameException.throwException(
        `You have a pending match request. Approve or reject it before submitting a new one.`,
        { matchId: match.id, matchStatus: match.status },
      );
    }
  }

  private _checkDestintatorStatus(dest: Player) {
    const playerStatus = dest.status;
    if (playerStatus === EPlayerStatus.Busy) {
      GameException.throwException(
        `Player "${dest.name}" is busy. Try again later.`,
        { playerId: dest.id, playerName: dest.name },
      );
    }

    if (playerStatus === EPlayerStatus.InMatch) {
      GameException.throwException(
        `Player "${dest.name}" is in another match. Wait until this match ends.`,
        { playerId: dest.id, playerName: dest.name },
      );
    }
  }

  private _createMatch(senderPlayer: Player, destPlayer: Player): Match {
    const match = new Match({
      id: uuidv4(),
      senderPlayer,
      destPlayer,
      status: EMatchStatus.Requested,
    });

    senderPlayer.status = destPlayer.status = EPlayerStatus.Busy;
    senderPlayer.match = destPlayer.match = match;

    return match;
  }
}
