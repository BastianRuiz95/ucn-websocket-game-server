import { Player } from './player.entity';
import { EMatchStatus } from '../enums';

export class Match {
  readonly id: string;
  readonly senderPlayer: Player;
  readonly destPlayer: Player;
  status: EMatchStatus;

  constructor(partial: Partial<Match>) {
    Object.assign(this, partial);
  }

  getPlayers() {
    return [this.senderPlayer.getPlayerData(), this.destPlayer.getPlayerData()];
  }
}
