import { Injectable } from '@nestjs/common';
import Redis from "ioredis";

const redis = new Redis("172.20.60.186");
const redispub = new Redis("172.20.60.186");

@Injectable()
export class RedislibService {

    async subscribe(channel: string) {

        return new Promise((resolve, reject) => {
            redis.subscribe(channel, (err, count) => {
              if (err) {
                reject(err);
              } else {
                console.log(`Subscribed to ${count} channels.`);
                resolve(count);
              }
            });
          });
    }


    async onReceive(channelName: string): Promise<string> {

        return new Promise((resolve, reject) => {
            redis.on("message", (channel, message) => {
              if (channel === channelName) {
                console.log(`Received message from ${channel} channel.`);
                try {
                  const parsedMessage = JSON.parse(message);
                  resolve(parsedMessage);
                } catch (err) {
                  reject(err);
                }
              }
            });
          });

    }


    async publish(channel: string, message: {}) {

        redispub.publish(channel, JSON.stringify({ ...message }));

    }

}
