// src/notifications/notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.engine.on('headers', (headers, req) => {
      const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
      const origin = req.headers.origin;

      if (allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin; // Dynamically set origin
      }
      headers['Access-Control-Allow-Credentials'] = 'true';
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  sendProjectUpdate(
    type: 'status' | 'approval' | 'active' | 'completion',
    projectId: string,
    value: string | boolean,
  ) {
    const payload = { projectId };

    switch (type) {
      case 'status':
        payload['status'] = value;
        this.server.emit('projectStatusUpdate', payload);
        break;
      case 'approval':
        payload['approved'] = value;
        this.server.emit('projectApprovalUpdate', payload);
        break;
      case 'active':
        payload['active'] = value;
        this.server.emit('projectActiveUpdate', payload);
        break;
      case 'completion':
        payload['completion_percentage'] = value;
        this.server.emit('projectCompletionUpdate', payload);
        break;
      default:
        throw new Error('Invalid update type');
    }
  }
}
