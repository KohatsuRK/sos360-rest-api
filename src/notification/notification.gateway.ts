import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure conforme sua política de CORS
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('Cliente conectado: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado: ', client.id);
  }

  // Método para emitir a notificação de nova emergência
  notifyNewEmergency(data: any) {
    this.server.emit('newEmergency', data);
  }
}