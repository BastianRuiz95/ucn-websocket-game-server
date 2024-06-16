import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SessionEntity } from '../entities';

import { Session } from '../../domain/models';
import { SessionRepository } from '../../domain/repositories';
import { CreateSessionParams } from '../../domain/repositories/params';

@Injectable()
export class SessionRepositoryImp implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {}

  async getSession(id: number): Promise<Session> {
    const result = await this.repository.findOne({
      where: { id },
      relations: { user: true },
    });

    return result;
  }

  async getSessionBySecret(secret: string): Promise<Session> {
    const result = await this.repository.findOne({
      where: { secret },
      relations: { user: true },
    });

    return result;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const result = await this.repository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    return result;
  }

  async createSession(params: CreateSessionParams): Promise<Session> {
    const session = await this.repository.save({
      secret: params.secret,
      creationDate: params.creationDate,
      expirationDate: params.expirationDate,
      user: { id: params.userId },
    });

    return session;
  }

  async deleteSession(id: number): Promise<Session> {
    const session = await this.getSession(id);
    await this.repository.remove(session);
    return session;
  }
}
