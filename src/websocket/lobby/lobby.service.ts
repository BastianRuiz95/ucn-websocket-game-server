import { Injectable } from '@nestjs/common';

import { Player } from '../common/entities';

import { ELobbyEvent } from './lobby-event.enum';
import { PlayerListService } from '../player-list/player-list.service';

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
      // Throw Error(`Player '${playerId}' not exists`)
      return;
    }

    playerToSendMsg.sendEvent(ELobbyEvent.PrivateMessageReceived, {
      msg: `Player '${senderPlayer.getName()}' sended you a private message`,
      playerId: senderPlayer.getId(),
      playerName: senderPlayer.getName(),
      playerMsg,
    });

    return {
      msg: `Message sended to ${playerToSendMsg.getName()}`,
    };
  }

  sendPublicMessage(senderPlayer: Player, playerMsg: string) {
    this.playerListService.broadcast(
      ELobbyEvent.PublicMessageReceived,
      {
        msg: `Player '${senderPlayer.getName()}' sended a message`,
        playerId: senderPlayer.getId(),
        playerName: senderPlayer.getName(),
        playerMsg,
      },
      senderPlayer.getId(),
    );

    return {
      msg: 'Message sended to all players',
    };
  }
}
