const { defaultFormatUtc } = require('moment');
const moment = require('moment');

function formatMessage(username, text){
return {
    username: username,
    text,
    time : moment().format('h:mm a')
}
}

const getMessages = async (id, roomId , offset = 0, size = 50) => {
    /**
     * Logic:
     * 1. Check if room with id exists
     * 2.check if user is a member of room
     * 2. Fetch messages from last hour
     **/
    const roomKey = `room:${roomId}`;
    const roomexist  = await sismember(`user:${id}:rooms`, `${roomId}`, function(err, reply){
        if (err) throw err;
    console.log(reply);
    });
    const roomExists = await exists(roomKey);
    if (!roomExists || !roomexist) {
      return [];
    } else {
      return new Promise((resolve, reject) => {
        redisClient.zrevrange(roomKey, offset, offset + size, (err, values) => {
          if (err) {
            reject(err);
          }
          resolve(values.map((val) => JSON.parse(val)));
        });
      });
    }
  };
  

module.exports = formatMessage;