export enum EMatchmakingEvent {
  // Event Trigger
  SendMatchRequest = 'send-match-request',
  CancelMatchRequest = 'cancel-match-request',

  // Event Reception
  MatchRequestReceived = 'match-request-received',
  MatchRequestCancelled = 'match-canceled-by-sender',
}
