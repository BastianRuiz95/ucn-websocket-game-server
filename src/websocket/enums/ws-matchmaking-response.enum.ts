export enum EWsMatchmakingResponse {
  PlayerDisconnected = 'player-disconnected',

  MatchRequestSended = 'match-request-sended',
  MatchRequestReceived = 'match-request-received',
  MatchAccepted = 'match-accepted',
  MatchRejected = 'match-rejected',
  MatchExpired = 'match-expired',
  UserInMatch = 'user-in-match',
  UserBusy = 'user-busy',
  CreatingMatchRoom = 'creating-match-room',
  MatchRoomCreated = 'match-room-created',
}