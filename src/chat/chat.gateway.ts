import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { RedislibService } from '@app/redislib';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private jwt: JwtService,
    private redisService: RedislibService) {}
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {

    try {
      const payload = this.jwt.verify(
      client.handshake.headers.authorization,
      );
      !true && client.disconnect();
      
    }
    catch (error) {

      console.error(error)
      client.disconnect();
 }   
  }

  afterInit(server: Server) {
    
  }

  handleDisconnect(client: Socket) {
    
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // const author = await this.chatService.getUserFromSocket(socket);
    const payload = {
      content,
      user: socket.id
    }
    this.redisService.publish('chat', payload)
 
    this.server.sockets.emit('receive_message', content);
 
    return content;
  }


  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    // publish chat
    
    console.log(`Connected ${client.id}`);
    return 'Hello world!';
  }

  




}
