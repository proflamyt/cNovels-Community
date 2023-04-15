import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { RedislibService } from '@app/redislib';

@Controller()
export class AppController {
  constructor(private redisService: RedislibService,
    private appService
    ) {
    this.redisService.subscribe('notifications')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('sse')
  async sse(): Promise<Observable<string>> {

    try {
      const message: string = await this.redisService.onReceive('notifications')
      return new Observable((observable) => {
        observable.next(message)
      })
    } catch (error) {
      console.log(error)
      
    }
  }
}
