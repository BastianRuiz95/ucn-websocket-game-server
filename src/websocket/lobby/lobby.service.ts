import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

import { ELobbyEvent } from './lobby-event.enum';
import { PlayerListService } from '../player-list/player-list.service';
import { GameException } from '../config/game.exception';

@Injectable()
export class LobbyService {
  constructor(private readonly playerListService: PlayerListService) {}

  getOnlinePlayers() {
    return this.playerListService.getPlayers().map((p) => p.getPlayerData());
  }

  sendPrivateMessage(
    senderPlayer: Player,
    playerId: string,
    playerMsg: string,
  ) {
    const playerToSendMsg = this.playerListService.getPlayerById(playerId);
    if (!playerToSendMsg) {
      GameException.throwException(`Player with ID ${playerId} not exists.`, {
        playerId,
      });
    }

    this._checkMessage(playerMsg);

    playerToSendMsg.sendEvent(
      ELobbyEvent.PrivateMessageReceived,
      `Player '${senderPlayer.name}' have sent you a private message.`,
      {
        playerId: senderPlayer.id,
        playerName: senderPlayer.name,
        playerMsg: playerMsg.trim(),
      },
    );

    return {
      msg: `Message sent to ${playerToSendMsg.name}`,
    };
  }

  sendPublicMessage(senderPlayer: Player, playerMsg: string) {
    this._checkMessage(playerMsg);

    this.playerListService.broadcast(
      ELobbyEvent.PublicMessageReceived,
      `Player '${senderPlayer.name}' have sent a message.`,
      {
        playerId: senderPlayer.id,
        playerName: senderPlayer.name,
        playerMsg: playerMsg.trim(),
      },
      senderPlayer.id,
    );

    return {
      msg: 'Message sent to all players',
    };
  }

  private _checkMessage(message: string) {
    if (!message || message.trim().length === 0) {
      GameException.throwException(`You cannot send an empty message`, {
        message: message ?? typeof message,
      });
    }
  }
}
