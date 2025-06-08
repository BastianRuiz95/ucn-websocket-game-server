import { Player } from './player.entity';
import { EMatchStatus } from '../enums';

export class Match {
  readonly id: string;
  readonly playerOne: Player;
  readonly playerTwo: Player;
  status: EMatchStatus;

  constructor(partial: Partial<Match>) {
    Object.assign(this, partial);
  }

  getPlayers() {
    return [this.playerOne.getPlayerData(), this.playerTwo.getPlayerData()];
  }
}
