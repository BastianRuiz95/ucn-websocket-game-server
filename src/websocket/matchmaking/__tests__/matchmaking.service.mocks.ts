import { WebSocket } from 'ws';
import { EPlayerStatus } from '../../common/enums';

const socketClient = { send: jest.fn() } as unknown as WebSocket;

export const PLAYER_AVAILABLE_MOCK_DATA = {
  id: 'player_id_available',
  name: 'Player available',
  status: EPlayerStatus.Available,
  socketClient,
};

export const PLAYER_BUSY_MOCK_DATA = {
  id: 'player_id_busy',
  name: 'Player busy',
  status: EPlayerStatus.Busy,
  socketClient,
};

export const PLAYER_IN_MATCH_MOCK_DATA = {
  id: 'player_id_in_match',
  name: 'Player in match',
  status: EPlayerStatus.InMatch,
  socketClient,
};

export const PLAYER_SENDER_MOCK_DATA = {
  id: 'player_id_sender',
  name: 'Player sender',
  status: EPlayerStatus.Available,
  socketClient,
};
