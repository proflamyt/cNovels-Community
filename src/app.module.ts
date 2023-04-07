import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contants/auth.constant';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      global: true,
      signOptions: { expiresIn: jwtConstants.period},
    })
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, NotificationGateway],
})
export class AppModule {}
