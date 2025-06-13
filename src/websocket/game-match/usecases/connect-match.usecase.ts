import { Injectable } from '@nestjs/common';
import { Match, Player } from 'src/websocket/common/entities';
import { EMatchPlayerStatus } from 'src/websocket/common/enums';
import { GameException } from 'src/websocket/config/game.exception';
import { EGameMatchListenerEvent } from '../game-match-events.enum';
import { GameResponse } from 'src/websocket/config/game-response.type';

@Injectable()
export class ConnectMatchUseCase {
  exec(player: Player): GameResponse {
    const { match } = player;

    const matchPlayer = this._checkMatchPlayerStatus(match, player);

    matchPlayer.status = EMatchPlayerStatus.Connected;

    this._checkBothPlayers(match);

    return {
      msg: 'You are ready to play.',
      data: { matchId: match.id },
    };
  }

  private _checkMatchPlayerStatus(match: Match, player: Player) {
    const { destPlayer, senderPlayer } = match;

    const playerToCheck =
      player === destPlayer.player ? destPlayer : senderPlayer;

    if (playerToCheck.status === EMatchPlayerStatus.Connected) {
      GameException.throwException(`You are already connected to this match`, {
        matchId: match.id,
        matchPlayerStatus: playerToCheck.status,
      });
    }

    if (playerToCheck.status === EMatchPlayerStatus.WaitingApprove) {
      GameException.throwException(
        `You need to approve this match request first.`,
        { matchId: match.id, matchStatus: match.status },
      );
    }

    return playerToCheck;
  }

  private _checkBothPlayers(match: Match) {
    const { player: senderPlayer, status: senderStatus } = match.senderPlayer;
    const { player: destPlayer, status: destStatus } = match.destPlayer;

    if (
      senderStatus === destStatus &&
      senderStatus === EMatchPlayerStatus.Connected
    ) {
      [senderPlayer, destPlayer].forEach((p) =>
        p.sendEvent(
          EGameMatchListenerEvent.PlayersReady,
          `Both players are ready to start. GLHF`,
          { matchId: match.id },
        ),
      );
    }
  }
}
