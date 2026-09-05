import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({ namespace: 'videos', cors: { origin: '*' } })
export class VideoGateway {
  @WebSocketServer() server!: Server;
  emit(event: string, payload: unknown) { this.server?.emit(event, payload); }
}
