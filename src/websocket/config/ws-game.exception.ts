import { WsException } from '@nestjs/websockets';

export class WsGameException extends WsException {
  constructor(
    public gameMessage: string,
    public data: object,
  ) {
    super(gameMessage);
  }
}
