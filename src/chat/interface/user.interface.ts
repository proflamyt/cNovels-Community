import { Socket, Server } from 'socket.io';

export interface SocketInterface extends Socket {
    username: string,
    userId: string

}

export interface Payload {
    content: string, 
    to: string,
     from?:string  
}