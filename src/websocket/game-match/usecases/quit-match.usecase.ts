import { Injectable } from '@nestjs/common';

import {
  EMatchPlayerStatus,
  EMatchStatus,
  EPlayerStatus,
} from 'src/websocket/common/enums';
import { Match, Player } from 'src/websocket/common/entities';

import { GameResponse } from 'src/websocket/config/game-response.type';
import { GameException } from 'src/websocket/config/game.exception';

import { EGameMatchListenerEvent } from '../game-match-events.enum';

@Injectable()
export class QuitMatchUseCase {
  exec(player: Player, opponent: Player): GameResponse {
    const { match } = player;
    this._validateMatch(match);

    this._removeMatch(player, match);

    opponent?.sendEvent(
      EGameMatchListenerEvent.CloseMatch,
      `Player ${player.name} has quit to the game. Rematch is not possible.`,
      null,
    );

    return {
      msg: `You have left the game.`,
      data: { playerStatus: player.status },
    };
  }

  private _validateMatch(match: Match) {
    if (match.status !== EMatchStatus.Finished) {
      GameException.throwException(`Match is not ended yet.`, {
        matchStatus: match.status,
      });
    }
  }

  private _removeMatch(player: Player, match: Match) {
    player.match = null;
    const { senderPlayer, destPlayer } = match;
    if (senderPlayer.player.id === player.id) {
      senderPlayer.status = EMatchPlayerStatus.LeftTheMatch;
    }
    if (destPlayer.player.id === player.id) {
      destPlayer.status = EMatchPlayerStatus.LeftTheMatch;
    }
    player.status = EPlayerStatus.Available;
  }
}
