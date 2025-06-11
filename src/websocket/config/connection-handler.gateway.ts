import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

import { generateRandomString } from 'src/modules/common/helpers/random';

import { PlayerService } from '../player/player.service';
import { PlayerListService } from '../player-list/player-list.service';
import { PlayerListServiceProvider } from '../player-list/player-service.provider';

import { EConnectionEvent } from './connection-event.enum';

@WebSocketGateway()
export class ConnectionHandlerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly playerService: PlayerService,
    private readonly playerListService: PlayerListService,
  ) {}

  afterInit() {
    PlayerListServiceProvider.set(this.playerListService);
  }

  handleConnection(client: WebSocket) {
    const playerName = `Player_${generateRandomString(5)}`;
    const player = this.playerService.createPlayer(client, playerName);

    this.playerListService.broadcast(EConnectionEvent.PlayerConnected, {
      msg: `Player '${playerName}' (${player.id}) has connected`,
      id: player.id,
      name: playerName,
    });

    this.playerListService.addPlayer(player);

    player.sendEvent(EConnectionEvent.ConnectedToServer, {
      msg: 'Welcome! You are connected to the game server',
      id: player.id,
      name: player.name,
    });
  }

  handleDisconnect(client: WebSocket) {
    const player = this.playerListService.getPlayerBySocket(client);

    this.playerListService.removePlayer(player);

    this.playerListService.broadcast(EConnectionEvent.PlayerDisconnected, {
      msg: `Player '${player.name}' (${player.id}) has disconnected`,
      id: player.id,
      name: player.name,
    });
  }

  @SubscribeMessage('ping')
  pong() {
    return 'pong';
  }
}
