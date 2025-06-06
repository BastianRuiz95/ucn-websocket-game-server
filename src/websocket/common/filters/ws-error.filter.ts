import { WebSocket } from 'ws';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { WsGameException } from '../../config/ws-game.exception';

@Catch(WsGameException)
export class WsErrorFilter implements ExceptionFilter {
  constructor(private readonly event: string) {}

  catch(exception: WsGameException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<WebSocket>();
    client.send(
      JSON.stringify({
        event: this.event,
        status: 'ERROR',
        data: {
          msg: exception.gameMessage,
          ...exception.data,
        },
      }),
    );
  }
}
