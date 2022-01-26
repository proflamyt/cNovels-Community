//import { createClient ,sismember,smembers, exists} from 'redis';
const {
    client: redisClient,
  
    smembers,
    sismember,
    srem,
    sub,
    auth: runRedisAuth,
  } = require('.\\redis');
// const redis_client = createClient({
//     host: '172.26.255.129',
//     port: 6379,
//    // password: '<password>'
//   });


async function userJoin(id, username, room){
    //check if user is in group
    await sismember(`user:${id}:rooms`, `${room}`, function(err, reply){
        if (err) throw err;
    console.log(reply);
    });

    return {
        id,
        username,
        room
    }
}

function getCurrentUser(id){
    return id;
}

//removes user from room 
async function userLeave(userId){

await srem("online_users", userId);
const msg = {
    ...socket.request.session.user,
    online: false,
  };
return {
    msg
    
}
}

function getRoomUsers(room){
    
    return smembers(`room:${room}:users`)

}
module.exports = {
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoomUsers
} 