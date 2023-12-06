const user = require('./models/userModel');
const notification = require('./models/notification');
let usersio = {};

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('setUserId', async (userId) => {
      if (userId) {
        const oneUser = await user.findById(userId).lean().exec();
        if (oneUser) {
          // Join a room based on userId
          socket.join(userId);
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });

    socket.on('getNotificationsLength', async (userId) => {
      const notifications = await notification
        .find({ user: userId, read: false })
        .lean();

      const notificationsLength = notifications.length || 0;

      // Emit the notifications length to the user who requested it
      usersio[userId]?.emit('notificationsLength', notificationsLength);

      // Broadcast the notifications length to all sockets in the room
      io.to(userId).emit('notificationsLength', notificationsLength);
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = Object.keys(usersio).find(
        (userId) => usersio[userId] === socket
      );

      if (disconnectedUserId) {
        console.log(`🔥 User with id ${disconnectedUserId} disconnected from socket`);
        usersio[disconnectedUserId] = null;
      }
    });
  });
};


/*
const user = require('./models/userModel');
const notification = require('./models/notification');
let usersio = [];

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('setUserId', async (userId) => {
      if (userId) {
        const oneUser = await user.findById(userId).lean().exec();
        if (oneUser) {
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });

    socket.on('getNotificationsLength', async (userId) => {
      const notifications = await notification
        .find({ user: userId, read: false })
        .lean();
      
      const notificationsLength = notifications.length || 0;

      // Emit the notifications length to the user who requested it
      usersio[userId]?.emit('notificationsLength', notificationsLength);

      // Broadcast the notifications length to all connected users
      io.emit('notificationsLength', notificationsLength);
    });

    socket.on('disconnect', () => {
      const disconnectedUserId = Object.keys(usersio).find(
        (userId) => usersio[userId] === socket
      );

      if (disconnectedUserId) {
        console.log(`🔥 User with id ${disconnectedUserId} disconnected from socket`);
        usersio[disconnectedUserId] = null;
      }
    });
  });
};
*/


/*
const user = require('./models/userModel');
const notification = require('./models/notification');
let usersio = [];

module.exports = function (io) {
  io.on('connection', (socket) => {
    socket.on('setUserId', async (userId) => {
      if (userId) {
        const oneUser = await user.findById(userId).lean().exec();
        if (oneUser) {
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });
    socket.on('getNotificationsLength', async (userId) => {
      const notifications = await notification
        .find({ user: userId, read: false })
        .lean();
      usersio[userId]?.emit('notificationsLength', notifications.length || 0);
    });

    socket.on('disconnect', (userId) => {
      console.log(`🔥 user with id ${userId} disconnected from socket`);
      usersio[userId] = null;
    });
  });
};

*/