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
      msg: `Player '${senderPlayer.name}' sended you a private message`,
      playerId: senderPlayer.id,
      playerName: senderPlayer.name,
      playerMsg,
    });

    return {
      msg: `Message sended to ${playerToSendMsg.name}`,
    };
  }

  sendPublicMessage(senderPlayer: Player, playerMsg: string) {
    this.playerListService.broadcast(
      ELobbyEvent.PublicMessageReceived,
      {
        msg: `Player '${senderPlayer.name}' sended a message`,
        playerId: senderPlayer.id,
        playerName: senderPlayer.name,
        playerMsg,
      },
      senderPlayer.id,
    );

    return {
      msg: 'Message sended to all players',
    };
  }
}
