export enum ELobbyEvent {
  // Event Trigger
  OnlinePlayers = 'online-players',
  SendPublicMessage = 'send-public-message',
  SendPrivateMessage = 'send-private-message',

  // Event Reception
  PublicMessageReceived = 'public-message',
  PrivateMessageReceived = 'private-message',
}
