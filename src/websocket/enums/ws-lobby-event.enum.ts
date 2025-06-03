export enum EWsLobbyEvent {
  GetPlayerData = 'get-player-data',
  GetConnectedPlayers = 'get-connected-players',
  ChangeNickname = 'change-nickname',
  
  SendPublicMessage = 'send-public-message',
  SendPrivateMessage = 'send-private-message',
  
  // @deprecate
  GetMyId = 'get-my-id',
}
