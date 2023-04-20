import { Controller, Get, Sse, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval, map, tap } from 'rxjs';
import { RedislibService } from '@app/redislib';

@Controller()
export class AppController {
  constructor(
    private redisService: RedislibService,
    private appService: AppService
    ) {
      this.redisService.onReceive('notifications')
    }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('notifications')
  sse(
    @Request() req,
    
  ) {

    try {
      return this.appService.subscribe().pipe(map((message) => ({ data: message })))
     
      
    } catch (error) {
      console.log(error)
      
    }
  }
}
