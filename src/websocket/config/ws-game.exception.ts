import { WsException } from '@nestjs/websockets';

export class WsGameException extends WsException {
  static throwException(message: string, data: object) {
    throw new WsGameException(message, data);
  }

  constructor(
    public gameMessage: string,
    public data: object,
  ) {
    super(gameMessage);
  }
}
