import { Session } from '../models';
import { CreateSessionParams } from './params';

export interface SessionRepository {
  getSession(id: number): Promise<Session>;
  getSessionBySecret(secret: string): Promise<Session>;

  getUserSessions(userId: string): Promise<Session[]>;

  createSession(params: CreateSessionParams): Promise<Session>;
  deleteSession(id: number): Promise<Session>;
}

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');
