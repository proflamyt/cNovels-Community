import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private jwt: JwtService,) {}
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    
    const payload = this.jwt.verify(
      client.handshake.headers.authorization,
    );
     
    !true && client.disconnect();
    
  }

  afterInit(server: Server) {
    
  }

  handleDisconnect(client: Socket) {
    
  }


  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(`Connected ${client.id}`);
    return 'Hello world!';
  }

  




}
