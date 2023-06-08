import { Controller, Get, Sse, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, map} from 'rxjs';
import { RedislibService } from '@app/redislib';

@Controller()
export class AppController {
  constructor(
    private redisService: RedislibService,
    private appService: AppService
    ) {
      
      this.redisService.onReceive('redis_notifications')
    }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('notifications')
  sse(): Observable<any> {

    try {
      return this.appService.subscribeNotification(1).pipe(map((message) => ({ data: message })));
      
    } catch (error) {
      console.log(error)
      
    }
  }
}
