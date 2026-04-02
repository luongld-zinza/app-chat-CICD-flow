import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { sender: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`Message received from ${payload.sender}: ${payload.message}`);
    this.server.emit('newMessage', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const count = this.server.sockets.sockets.size;
    this.logger.log(`Total connections: ${count}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const count = this.server.sockets.sockets.size;
    this.logger.log(`Total connections: ${count}`);
  }

}
