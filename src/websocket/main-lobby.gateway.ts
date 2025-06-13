import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

import { generateRandomString } from 'src/modules/common/helpers/random';

import { Player } from './common/entities';
import { ConnectedPlayer, WsEventListener } from './common/decorators';

import { PlayerService } from './player/player.service';
import { PlayerListService } from './player-list/player-list.service';
import { PlayerListServiceProvider } from './player-list/player-service.provider';

import {
  ELobbyTriggerEvent,
  EMatchmakingTriggerEvent,
  EPlayerTriggerEvent,
} from './common/enums';

import { LobbyEvents } from './lobby/lobby.events';
import { PlayerEvents } from './player/player.events';
import { MatchmakingEvents } from './matchmaking/matchmaking.events';
import { EConnectionEvent } from './config/connection-event.enum';

@WebSocketGateway()
export class MainLobbyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly playerService: PlayerService,
    private readonly playerListService: PlayerListService,

    private readonly playerEvents: PlayerEvents,
    private readonly lobbyEvents: LobbyEvents,
    private readonly matchmakingEvents: MatchmakingEvents,
  ) {}

  afterInit() {
    PlayerListServiceProvider.set(this.playerListService);
  }

  handleConnection(client: WebSocket) {
    const playerName = `Player_${generateRandomString(8)}`;
    const player = this.playerService.createPlayer(client, playerName);

    this.playerListService.broadcast(
      EConnectionEvent.PlayerConnected,
      `Player '${playerName}' (${player.id}) has connected`,
      { id: player.id, name: playerName },
    );

    this.playerListService.addPlayer(player);

    player.sendEvent(
      EConnectionEvent.ConnectedToServer,
      'Welcome! You are connected to the game server',
      { id: player.id, name: player.name },
    );
  }

  handleDisconnect(client: WebSocket) {
    const player = this.playerListService.getPlayerBySocket(client);

    this.playerListService.removePlayer(player);

    this.playerListService.broadcast(
      EConnectionEvent.PlayerDisconnected,
      `Player '${player.name}' (${player.id}) has disconnected`,
      { id: player.id, name: player.name },
    );
  }

  // ------------------------------------
  //           Player Events
  // ------------------------------------

  @WsEventListener(EPlayerTriggerEvent.ChangeName)
  changeUserName(@ConnectedPlayer() player: Player, @MessageBody() data) {
    return this.playerEvents.changeUserName(player, data);
  }

  @WsEventListener(EPlayerTriggerEvent.PlayerData)
  getPlayerData(@ConnectedPlayer() player: Player) {
    return this.playerEvents.getPlayerData(player);
  }

  // ------------------------------------
  //           Lobby Events
  // ------------------------------------

  @WsEventListener(ELobbyTriggerEvent.OnlinePlayers)
  getConnectedPlayers() {
    return this.lobbyEvents.getConnectedPlayers();
  }

  @WsEventListener(ELobbyTriggerEvent.SendPrivateMessage)
  sendPrivateMessage(@ConnectedPlayer() player: Player, @MessageBody() data) {
    return this.lobbyEvents.sendPrivateMessage(player, data);
  }

  @WsEventListener(ELobbyTriggerEvent.SendPublicMessage)
  sendPublicMessage(@ConnectedPlayer() player: Player, @MessageBody() data) {
    return this.lobbyEvents.sendPublicMessage(player, data);
  }

  // ------------------------------------
  //        Matchmaking Events
  // ------------------------------------

  @WsEventListener(EMatchmakingTriggerEvent.SendMatchRequest)
  sendMatchRequest(@ConnectedPlayer() player: Player, @MessageBody() body) {
    return this.matchmakingEvents.sendMatchRequest(player, body);
  }

  @WsEventListener(EMatchmakingTriggerEvent.CancelMatchRequest)
  cancelMatchRequest(@ConnectedPlayer() player: Player) {
    return this.matchmakingEvents.cancelMatchRequest(player);
  }

  @WsEventListener(EMatchmakingTriggerEvent.AcceptMatch)
  acceptMatchRequest(@ConnectedPlayer() player: Player) {
    return this.matchmakingEvents.acceptMatchRequest(player);
  }

  @WsEventListener(EMatchmakingTriggerEvent.RejectMatch)
  rejectMatchRequest(@ConnectedPlayer() player: Player) {
    return this.matchmakingEvents.rejectMatchRequest(player);
  }
}
