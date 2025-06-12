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
    playerToSend.sendEvent(
      EMatchmakingEvent.MatchRequestReceived,
      `Match request received from player '${senderPlayer.name}'`,
      {
        playerId: senderPlayer.id,
        matchId: match.id,
      },
    );

    return {
      msg: `Match request sent to player '${playerToSend.name}'.`,
      data: { matchId: match.id },
    };
  }

  cancelMatchRequest(senderPlayer: Player) {
    const { match } = senderPlayer;
    this._checkMatchStatus(senderPlayer);
    this._checkCancelMatchRequestOwner(match, senderPlayer);

    const { destPlayer } = match;
    this._deleteMatchRequest(match);

    destPlayer.sendEvent(
      EMatchmakingEvent.MatchRequestCancelled,
      `Player '${senderPlayer.name}' has cancelled the match request.`,
      {
        playerId: senderPlayer.id,
        playerName: senderPlayer.name,
      },
    );

    return {
      msg: `The match request to player '${destPlayer.name}' has been cancelled.`,
      data: { playerId: destPlayer.id },
    };
  }

  acceptMatchRequest(destPlayer: Player) {
    const { match } = destPlayer;
    this._checkMatchStatus(destPlayer);
    this._checkAcceptMatchRequestDestinator(match, destPlayer);

    this._acceptMatch(match);

    const { senderPlayer } = match;
    senderPlayer.sendEvent(
      EMatchmakingEvent.MatchRequestAccepted,
      `Player '${destPlayer.name}' has rejected your match request.`,
      {
        playerId: destPlayer.id,
        playerName: destPlayer.name,
        matchId: match.id,
        matchStatus: match.status,
      },
    );

    return {
      msg: `The match request from player '${senderPlayer.name}' has been accepted.`,
      data: {
        playerId: senderPlayer.id,
        matchId: match.id,
        matchStatus: match.status,
      },
    };
  }

  rejectMatchRequest(destPlayer: Player) {
    const { match } = destPlayer;
    this._checkMatchStatus(destPlayer);
    this._checkRejectMatchRequestDestinator(match, destPlayer);

    const { senderPlayer } = match;
    this._deleteMatchRequest(match);

    senderPlayer.sendEvent(
      EMatchmakingEvent.MatchRequestRejected,
      `Player '${destPlayer.name}' has rejected your match request.`,
      { playerId: destPlayer.id, playerName: destPlayer.name },
    );

    return {
      msg: `The match request from player '${senderPlayer.name}' has been rejected.`,
      data: { playerId: senderPlayer.id },
    };
  }

  private _checkSenderStatus(sender: Player) {
    if (sender.status === EPlayerStatus.Available) {
      return;
    }

    const match = sender.match;
    const result = { matchId: match.id, matchStatus: match.status };

    if (sender.status === EPlayerStatus.InMatch) {
      GameException.throwException(
        `You cannot send match requests because you are already in one.`,
        result,
      );
    }

    GameException.throwException(
      sender.id === match.senderPlayer.id
        ? `You have already submitted a match request. Wait for it to be approved or rejected, or wait a few seconds.`
        : `You have a pending match request. Approve or reject it before submitting a new one.`,
      result,
    );
  }

  private _checkDestintatorStatus(dest: Player) {
    const playerStatus = dest.status;
    const result = { playerId: dest.id, playerName: dest.name };

    if (playerStatus === EPlayerStatus.Busy) {
      GameException.throwException(
        `Player '${dest.name}' is busy. Try again later.`,
        result,
      );
    }

    if (playerStatus === EPlayerStatus.InMatch) {
      GameException.throwException(
        `Player '${dest.name}' is in another match. Wait until this match ends.`,
        result,
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

  private _checkMatchStatus(senderPlayer: Player) {
    const { match } = senderPlayer;
    if (!match) {
      GameException.throwException(`You do not have an active match request.`, {
        playerStatus: senderPlayer.status,
      });
    }

    if (match.status !== EMatchStatus.Requested) {
      GameException.throwException(
        `Match is in progress and cannot be cancelled or rejected.`,
        { matchStatus: match.status },
      );
    }
  }

  private _checkCancelMatchRequestOwner(match: Match, senderPlayer: Player) {
    if (match.senderPlayer.id !== senderPlayer.id) {
      GameException.throwException(
        `You cannot cancel an incoming match request. You need to reject it with the event '${EMatchmakingEvent.RejectMatch}'.`,
        { matchStatus: match.status },
      );
    }
  }

  private _checkRejectMatchRequestDestinator(match: Match, destPlayer: Player) {
    if (match.destPlayer.id !== destPlayer.id) {
      GameException.throwException(
        `You cannot reject a match request you have sent. You need to cancel it with the event '${EMatchmakingEvent.CancelMatchRequest}'.`,
        { matchStatus: match.status },
      );
    }
  }

  private _checkAcceptMatchRequestDestinator(match: Match, destPlayer: Player) {
    if (match.destPlayer.id !== destPlayer.id) {
      GameException.throwException(
        `You cannot accept a match request you have sent.`,
        { matchStatus: match.status },
      );
    }
  }

  private _acceptMatch(match: Match) {
    const { senderPlayer, destPlayer } = match;

    match.status = EMatchStatus.WaitingPlayers;
    senderPlayer.status = destPlayer.status = EPlayerStatus.InMatch;
  }

  private _deleteMatchRequest(match: Match) {
    const { senderPlayer, destPlayer } = match;

    senderPlayer.match = destPlayer.match = null;
    senderPlayer.status = destPlayer.status = EPlayerStatus.Available;
  }
}
