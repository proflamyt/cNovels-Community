import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {


  @SubscribeMessage('notification')
  handleNotification(client: Socket, payload: any): string {
    // subscribe to notifications from redis
    console.log(`Connected ${client.id}`);
    return 'Hello world!';
  }


}
