import { OnGatewayConnection, OnGatewayDisconnect,
   SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketInterface } from 'src/chat/interface';

@WebSocketGateway({ namespace: '/group' })
export class GroupsGateway implements OnGatewayConnection, OnGatewayDisconnect  {

  @WebSocketServer() server:Server;
  users = 0
  
  async handleConnection() {
    // A client has connected authenticate and add to group

  }
  async handleDisconnect() {
    // send connected users too
    this.server.emit('users', this.users);
  }
  @SubscribeMessage('group:join')
  async onJoin(client: SocketInterface, room: string) {
    client.join(room);
    client.to(room).emit(`${client.username} joined`)
  }

  @SubscribeMessage('group:chat')
  async onChat(client: SocketInterface, message:string) {

    const payload  = JSON.parse(message)

    if (payload.room in client.rooms)
          client.to(payload.room).emit('group:chat', message);
  }
}
