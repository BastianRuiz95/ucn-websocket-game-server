import { Injectable } from '@nestjs/common';
import { Match, Player } from 'src/websocket/common/entities';
import { EMatchStatus } from 'src/websocket/common/enums';
import { GameException } from 'src/websocket/config/game.exception';
import { EGameMatchListenerEvent } from '../game-match-events.enum';
import { GameResponse } from 'src/websocket/config/game-response.type';

@Injectable()
export class SendDataUseCase {
  exec(player: Player, data: object, opponent: Player): GameResponse {
    const { match } = player;
    this._validateMatch(match);

    opponent.sendEvent(
      EGameMatchListenerEvent.ReceiveData,
      `Event received from match.`,
      data,
    );

    return {
      msg: 'Data sended successfully.',
    };
  }

  private _validateMatch(match: Match) {
    const { status } = match;

    if (status !== EMatchStatus.Playing) {
      GameException.throwException(`The match is not started or is finished.`, {
        matchStatus: status,
      });
    }
  }
}
