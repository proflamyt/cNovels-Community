import { Module } from '@nestjs/common';
import { RedislibService } from './redislib.service';

@Module({
  providers: [RedislibService],
  exports: [RedislibService],
})
export class RedislibModule {}
