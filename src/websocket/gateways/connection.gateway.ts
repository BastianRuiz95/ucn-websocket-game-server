import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { WS_PORT } from '../constants';
import { SocketService } from '../services/socket.service';
import { EWsConnectionResponse } from '../enums';

@WebSocketGateway(WS_PORT)
export class ConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: WebSocket) {
    const playerId = uuidv4();

    this.socketService.sendEventToAllPlayers({
      event: EWsConnectionResponse.PlayerConnected,
      data: {
        msg: `Player ${playerId} has connected`,
        id: playerId,
      },
    });

    this.socketService.addPlayer(playerId, socket);

    this.socketService.sendEventToPlayer(socket, {
      event: EWsConnectionResponse.ConnectedToServer,
      data: {
        msg: 'You are connected to the game server',
        id: playerId,
      },
    });
  }

  handleDisconnect(socket: WebSocket) {
    const player = this.socketService.getPlayerBySocket(socket);

    const data = {
      msg: `Player ${player.id} has disconnected`,
      id: player.id,
    };

    this.socketService.sendEventToAllPlayers({
      event: EWsConnectionResponse.PlayerDisconnected,
      data,
    });

    this.socketService.removePlayer(socket);
  }
}
