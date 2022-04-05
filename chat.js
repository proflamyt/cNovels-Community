const express = require('express');
const path = require('path')
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('.\\utils\\messages');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { userJoin, getCurrentUser,userLeave, getRoomUsers } = require('.\\utils\\users');
const {
  client: redisClient,
  exists,
  set,
  get,
  sadd,
  zadd,
  smembers,
  sismember,
  srem,
  sub,
  auth: runRedisAuth,
} = require('.\\utils\\redis');


const app = express();
const server  =  http.createServer(app)
const io = socketio(server,{
    cors: {
        origin: "*"
      }
}
   );

const PORT = 3001 || process.env.PORT;


app.use(express.static(path.join(__dirname, 'public')));



bot = 'cNovels'

// io.adapter(redis({ 
//   host: '172.26.255.129', 
//   port: 6379
//  }));
// const redis_client = redis.createClient({
//   host: '172.26.255.129',
//   port: 6379,
//  // password: '<password>'
// });

// redis_client.on('error', err => {
// console.log('Error ' + err);
// });

redisClient.on('error', (err) => {
  console.log('Error occured while connecting or accessing redis server');
});
if(!redisClient.get('customer_name',redis.print)) {
  //create a new record
  redisClient.set('customer_name','John Doe', redis.print);
  console.log('Writing Property : customer_name');
} else {
  let val = redisClient.get('customer_name',redis.print);
  console.log(`Reading property : customer_name - ${val}`);
}






// redis_client.on("message", function(channel, message) {
// 	console.log("Subscribed to " + channel + ". Now subscribed to " + message + " channel(s).");
//   //decode message and send jwt , store the rest in a variable
//   //send to message function
  
//   //io.emit('authenticate', { token: jwt })
// });









// redis_client.subscribe("notification");
//debug 


io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, 'wbnmxg&v=tc^vdqm8w2sho=4$qfiwex-v6e!a6*4v&dkj5#2y3', function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      console.log(decoded);
      socket.decoded_token = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }    
})
.on('connection', async (socket) => {
    //const sessionID = socket.handshake.auth.sessionID;
    const userID = socket.decoded_token.user_id;
    const username = socket.decoded_token.username;

    // store all user details temporarily on redis , update the django postgres later 

    // TODO: get all rooms user is a member of on django , must verify on redis 
   
    // join room with room ID   and update redis to verify where users can send message

    socket.on('joinRoom', async (room) => {
      
      // add user to redis room and update django if not already in group
      const user = userJoin(userID, username, room);

      // add to online user of that room 

      await sadd(`online_users:${user.room}`, userID);

      socket.join(user.room);

      console.log('a user is connected');

      //single connected client in the group

      socket.emit('message', formatMessage(bot, 'welcome to the group'));

      //every client except connected user
      socket.broadcast.to(user.room).emit('message', formatMessage(bot, `a ${user.username} has connected`));

      // lists of users in that room5
      io.to(user.room).emit('roomUsers', {
        users: getRoomUsers(user.room),
      });


    });




    //listen for chat message
    socket.on('chatMessage', async (message
      /**
       //    * @param {{
       // *  from: string
       // *  date: number
       // *  message: string
       // *  roomId: string
       // * }} messae
       // **/
    ) => {
      //message = { ...message, message: sanitise(message.message) };
      // const user  =  getCurrentUser(socket.id)
      const messageString = JSON.stringify(message);
      const roomKey = `room:${message.roomId}`;
      const isPrivate = !(await exists(`${roomKey}:name`));
      const roomHasMessages = await exists(roomKey);
      if (isPrivate && !roomHasMessages) {
        const ids = message.roomId.split(":");
        const msg = {
          id: message.roomId,
          names: [
            await get(`user:${ids[0]}`, "username"),
            await get(`user:${ids[1]}`, "username"),
          ],
        };
        publish("privatem", msg);
        socket.broadcast.emit(`show.room`, msg);
      }
      await zadd(roomKey, "" + message.date, messageString);
      publish("group", message);

      io.to(roomKey).emit('message', formatMessage(user.username, msg));
    });



    socket.on('disconnect', () => {
      user = userLeave(userID);

      io.to(user.room).emit('message', formatMessage(bot, `${username} has left`));


      io.to(user.room).emit('roomUsers', {
        users: getRoomUsers(user.room),
      });
    });


  })

//publish message 

server.listen(PORT, () => {
  console.log(`server is running on port, ${PORT}`);
});