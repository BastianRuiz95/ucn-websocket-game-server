import { v4 as uuidv4 } from 'uuid';

import { Player } from './player.entity';
import { EMatchStatus } from '../enums';
import { PlayerPresenter } from '../presenters';

export class Match {
  private readonly id: string;
  constructor(
    private status: EMatchStatus,
    private readonly playerOne: Player,
    private readonly playerTwo: Player,
  ) {
    this.id = uuidv4();
  }

  getId(): string {
    return this.id;
  }

  getStatus(): EMatchStatus {
    return this.status;
  }

  setStatus(status: EMatchStatus): void {
    this.status = status;
  }

  getPlayers(): Player[] {
    return [this.playerOne, this.playerTwo];
  }

  getPlayersData(): PlayerPresenter[] {
    return [this.playerOne.getPlayerData(), this.playerTwo.getPlayerData()];
  }
}
