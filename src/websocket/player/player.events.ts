import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';
import { EPlayerStatus } from '../common/enums';
import { EConnectionListenEvent, EPlayerTriggerEvent } from '../common/events';

import { GameResponse } from '../config/game-response.type';
import { GameException } from '../config/game.exception';

import { GameService } from '../game/game.service';
import { PlayerListService } from '../player-list/player-list.service';

import { ChangeUserNameDto, LoginDto } from './dtos';

@Injectable()
export class PlayerEvents {
  constructor(
    private readonly gameService: GameService,
    private readonly playerListService: PlayerListService,
  ) {}

  connected(player: Player, gameId: string) {
    if (!player.game) {
      player.sendEvent(
        EConnectionListenEvent.ConnectedToServer,
        'GameId do not exists or is invalid.',
        { gameId: gameId ?? null },
        'ERROR',
      );
      player.socketClient.close(4000);
      return;
    }

    this.playerListService.addPlayer(player);

    player.sendEvent(
      EConnectionListenEvent.ConnectedToServer,
      `Welcome! You are connected to the game server. Login first with '${EPlayerTriggerEvent.Login}' event`,
      player.getPlayerData(),
      'OK',
    );
  }

  disconnected(player: Player) {
    if (!player) return;

    this.playerListService.removePlayer(player);

    this.playerListService.broadcast(
      EConnectionListenEvent.PlayerDisconnected,
      `Player '${player.name}' (${player.id}) has disconnected`,
      player.getPlayerData(),
    );
  }

  login(player: Player, { gameKey }: LoginDto): GameResponse {
    if (player.status !== EPlayerStatus.NoLogin) {
      GameException.throwException('You are already login in the server.');
    }

    if (this.gameService.checkGameKey(player.game.id, gameKey)) {
      player.status = EPlayerStatus.Available;

      this.playerListService.broadcast(
        EConnectionListenEvent.PlayerConnected,
        `Player '${player.name}' (${player.id}) has connected`,
        player.getPlayerData(),
        player.id,
      );

      return {
        msg: 'Login Successfully',
        data: player.getPlayerData(),
      };
    }

    return {
      msg: 'Invalid GameKey.',
    };
  }

  changeUserName(player: Player, data: ChangeUserNameDto): GameResponse {
    player.name = data.name;
    return {
      msg: 'Name changed',
      data: { name: player.name },
    };
  }

  getPlayerData(player: Player): GameResponse {
    return {
      msg: 'Player list obtained',
      data: player.getPlayerData(),
    };
  }
}
