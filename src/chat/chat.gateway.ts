import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { RedislibService } from '@app/redislib';
import { Payload, SocketInterface } from './interface';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private jwt: JwtService,
    private redisService: RedislibService) {}
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: SocketInterface, ...args: any[]) {

    try {

      const payload = this.jwt.verify(
      client.handshake.headers.authorization,
      );

      !payload.sub && client.disconnect();

      client.userId = payload.sub
      client.username = payload.username
      client.join(client.userId)
      
      
    }
    catch (error) {
      client.disconnect();
        }   
  }

  afterInit(server: Server) {
    
  }

  async handleDisconnect(client: SocketInterface) {

    const matchingSockets = await this.server.in(client.userId).allSockets();
    
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      
      client.broadcast.emit("privateMessage", client.userId);
      // update the connection status of the session
      
    }
    
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(client: SocketInterface, receivedPayload:string ) {

      try {
            const payload: Payload = JSON.parse(receivedPayload)
        
            const from = client.userId;
        
            payload.from = from;

            this.redisService.publish('chat', payload)

            client.to(payload.to).to(from).emit('privateMessages', { content: payload.content, from, to: payload.to });

      } catch (error) {

        console.log(error)
        
}
    
  }


}
