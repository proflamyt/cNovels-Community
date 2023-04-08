
import { RedislibService } from '@app/redislib';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';


@WebSocketGateway()
export class NotificationGateway {

  constructor(private readonly redisService: RedislibService) {
    this.redisService.subscribe('notifications')
  }


  @SubscribeMessage('notification')
  async handleNotification(client: Socket, payload: any) {
    
    try {

      // subscribe to notifications from redis
      const message: string = await this.redisService.onReceive('notifications')
      client.emit(message)

    }
    catch (error) {
      return error
    }
  
  }


}

