import WebSocket from 'ws';

import { Player } from './player';
import { EWsPlayerStatus } from '../enums';

export interface PlayerSocket extends Player {
  socket: WebSocket;
  status: EWsPlayerStatus;
}
