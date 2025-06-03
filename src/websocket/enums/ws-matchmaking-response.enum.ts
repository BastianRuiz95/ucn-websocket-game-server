export enum EWsMatchmakingResponse {
  PlayerDisconnected = 'player-disconnected',
  PlayerInMatch = 'player-in-match',
  PlayerBusy = 'player-busy',

  MatchRequestSended = 'match-request-sended',
  MatchRequestReceived = 'match-request-received',
  MatchAccepted = 'match-accepted',
  MatchRejected = 'match-rejected',
  MatchExpired = 'match-expired',
  
  CreatingMatchRoom = 'creating-match-room',
  MatchRoomCreated = 'match-room-created',
}