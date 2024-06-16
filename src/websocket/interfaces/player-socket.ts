import WebSocket from 'ws';
import { Player } from './player';

export interface PlayerSocket extends Player {
  socket: WebSocket;
}
