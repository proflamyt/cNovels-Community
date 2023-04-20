import { Injectable } from '@nestjs/common';
import {fromEvent, tap} from "rxjs";
import { eventEmitter } from './utils';


@Injectable()
export class AppService { 

  subscribe() {
    return fromEvent(eventEmitter, 'eventName')
  }



  getHello(): string {
    return 'Hello World!';



  }
}
