import { SubscribeMessage } from '@nestjs/websockets';
import { applyDecorators, UseFilters } from '@nestjs/common';

import { WsGameExceptionFilter } from '../filters/ws-game-exception.filter';

export function WsEventListener(event: string) {
  return applyDecorators(
    UseFilters(new WsGameExceptionFilter(event)),
    SubscribeMessage(event),
  );
}
