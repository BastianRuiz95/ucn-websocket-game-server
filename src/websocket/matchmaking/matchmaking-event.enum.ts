export enum EMatchmakingEvent {
  // Event Reception
  MatchRequestReceived = 'match-request-received',
  MatchRequestCancelled = 'match-canceled-by-sender',

  MatchRequestAccepted = 'match-accepted',
  MatchRequestRejected = 'match-rejected',
}
