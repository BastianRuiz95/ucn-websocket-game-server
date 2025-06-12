import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { GameResponse } from '../../config/game-response.type';

@Injectable()
export class WsParseResultInterceptor implements NestInterceptor {
  constructor(private readonly event: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((resData: GameResponse) => {
        const { data, msg } = resData;
        return { event: this.event, status: 'OK', msg, data };
      }),
    );
  }
}
