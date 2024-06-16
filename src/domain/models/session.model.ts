import { User } from './user.model';

export interface Session {
  id: number;
  secret: string;
  creationDate: Date;
  expirationDate: Date;

  user?: User;
}
