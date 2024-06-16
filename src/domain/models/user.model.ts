import { Session } from './session.model';

export interface User {
  id: string;
  name: string;

  sessions?: Session[];
}
