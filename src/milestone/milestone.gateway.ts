import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Allow cross-origin requests if needed
export class MilestoneGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // Lifecycle hooks
  afterInit(server: Server) {
    console.log('Socket.IO initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Emit milestone update events
  notifyMilestoneUpdate(event: string, data: any) {
    this.server.emit(event, data); // Broadcast to all connected clients
  }
}
