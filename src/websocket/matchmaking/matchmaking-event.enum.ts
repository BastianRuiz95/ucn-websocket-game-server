export enum EMatchmakingEvent {
  // Event Trigger
  SendMatchRequest = 'send-match-request',
  CancelMatchRequest = 'cancel-match-request',
  AcceptMatch = 'accept-match',
  RejectMatch = 'reject-match',

  // Event Reception
  MatchRequestReceived = 'match-request-received',
  MatchRequestCancelled = 'match-canceled-by-sender',

  MatchRequestAccepted = 'match-accepted',
  MatchRequestRejected = 'match-rejected',
}
