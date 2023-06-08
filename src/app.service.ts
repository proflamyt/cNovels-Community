import { Injectable } from '@nestjs/common';
import {distinctUntilChanged, filter, fromEvent, tap} from "rxjs";
import { eventEmitter } from './utils';


@Injectable()
export class AppService { 

  subscribeNotification(userId:number) {
    
    const source = fromEvent(eventEmitter, 'liveNotification').pipe(distinctUntilChanged());
    return source.pipe(
      filter(({ data: liveNotification }) => 
        liveNotification?.content == 'heartbeat' || 
        liveNotification?.sellerId == userId)
    );
     
  }



  getHello(): string {
    return 'Hello World!';



  }
}
