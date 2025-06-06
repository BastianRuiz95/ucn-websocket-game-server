import { SubscribeMessage } from '@nestjs/websockets';
import { applyDecorators, UseFilters } from '@nestjs/common';

import { WsErrorFilter } from '../filters/ws-error.filter';

export function WsEventListener(event: string) {
  return applyDecorators(
    UseFilters(new WsErrorFilter(event)),
    SubscribeMessage(event),
  );
}
