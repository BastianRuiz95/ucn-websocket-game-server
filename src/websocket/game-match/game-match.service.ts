import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

@Injectable()
export class GameMatchService {
  constructor() {}

  connectMatch(player: Player) {}

  pingMatch(player: Player) {}

  sendData(player: Player) {}

  finishGame(player: Player) {}

  sendRematchRequest(player: Player) {}

  quitMatch(player: Player) {}
}
