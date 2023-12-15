
/*
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
*/



const user = require('./models/userModel');
const notification = require('./models/notification');
const users = [];
//let usersio = {};

module.exports = function (io) {
  io.on('connection', (socket) => {
    // Notification Logic
    socket.on('setUserId', async (userId) => {
      if (userId) {
        const oneUser = await user.findById(userId).lean().exec();
        if (oneUser) {
          socket.join(userId);
          users[userId] = socket;
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

      users[userId]?.emit('notificationsLength', notificationsLength);
      io.to(userId).emit('notificationsLength', notificationsLength);
    });
    socket.on('disconnect', () => {
      const disconnectedUserId = Object.keys(users).find(
        (userId) => users[userId] === socket
      );

      if (disconnectedUserId) {
        console.log(`🔥 User with id ${disconnectedUserId} disconnected from socket`);
        users[disconnectedUserId] = null;
      }
    });
 
    // Chat Logic
    socket.on('onLogin', (user) => {
      const updatedUser = {
        ...user,
        online: true,
        socketId: socket.id,
        messages: [],
      };
      const existUser = users.find((x) => x.name === updatedUser.name);
      if (existUser) {
        existUser.socketId = socket.id;
        existUser.online = true;
      } else {
        users.push(updatedUser);
      }
      const admin = users.find((x) => x.name === 'Admin' && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', updatedUser);
      }
      if (updatedUser.name === 'Admin') {
        io.to(updatedUser.socketId).emit('listUsers', users);
      }
    });

    socket.on('disconnect', () => {
      const user = users.find((x) => x.socketId === socket.id);
      if (user) {
        user.online = false;
        const admin = users.find((x) => x.name === 'Admin' && x.online);
        if (admin) {
          io.to(admin.socketId).emit('updateUser', user);
        }
      }
    });

    socket.on('onUserSelected', (selectedUser) => {
      const admin = users.find((x) => x.name === 'Admin' && x.online);
      if (admin) {
        const existUser = users.find((x) => x.name === selectedUser.name);
        io.to(admin.socketId).emit('selectUser', existUser);
      }
    });

    socket.on('onMessage', (message) => {
      if (message.from === 'Admin') {
        const user = users.find((x) => x.name === message.to && x.online);
        if (user) {
          io.to(user.socketId).emit('message', message);
          user.messages.push(message);
        } else {
          io.to(socket.id).emit('message', {
            from: 'System',
            to: 'Admin',
            body: 'User Is Not Online',
          });
        }
      } else {
        const admin = users.find((x) => x.name === 'Admin' && x.online);
        if (admin) {
          io.to(admin.socketId).emit('message', message);
          const user = users.find((x) => x.name === message.from && x.online);
          if (user) {
            user.messages.push(message);
          }
        } else {
          io.to(socket.id).emit('message', {
            from: 'System',
            to: message.from,
            body: 'Sorry. Admin is not online right now',
          });
        }
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