import { Injectable } from '@nestjs/common';
import { Match, Player } from 'src/websocket/common/entities';
import { EMatchStatus } from 'src/websocket/common/enums';
import { GameException } from 'src/websocket/config/game.exception';
import { EGameMatchListenerEvent } from '../game-match-events.enum';
import { GameResponse } from 'src/websocket/config/game-response.type';

@Injectable()
export class FinishGameUseCase {
  exec(player: Player, opponent: Player): GameResponse {
    const { match } = player;
    this._validateMatch(match);

    this._finishGame(match);

    opponent.sendEvent(
      EGameMatchListenerEvent.GameEnded,
      `Game over! ${player.name} wins!`,
      { matchStatus: match.status },
    );

    return {
      msg: `Game over! ${player.name} wins!`,
      data: { matchStatus: match.status },
    };
  }

  private _validateMatch(match: Match) {
    const { status } = match;

    if (status === EMatchStatus.Finished) {
      GameException.throwException(`The match has already finished.`, {
        matchStatus: status,
      });
    }

    if (status !== EMatchStatus.Playing) {
      GameException.throwException(`The match has not been started yet.`, {
        matchStatus: status,
      });
    }
  }

  private _finishGame(match: Match) {
    match.status = EMatchStatus.Finished;
  }
}
