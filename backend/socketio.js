const user = require('./models/userModel');
const notification = require('./models/notification');
const clientModel = require("./models/clientModel");
const chatModel = require("./models/chatModel");

const users = [];
const connectedHosts = [];

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


    //chat logic
    socket.on('start chat', async (userData) => {
      console.log('User started a chat:', userData);

      try{
      //find user
      let user = await clientModel.findOne({email: userData.email});

      //Creating new user
      if(!user){
          console.log("new user");
          user = new clientModel({
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            });

          await user.save();
      }

      //find Chat for the user
      let chat = await chatModel.findOne({userId: user._id});

      if(!chat){
      // Create a new chat instance for the user
      chat = new chatModel({
          userId: user._id,
          messages: [],
      });
      await chat.save();
      }

      // Add the user to their own room
      socket.join(user._id.toString());

      //Notify user that chat is initialized and send chat history
      io.to(socket.id).emit('chat initialized',{userId: user._id, chatId: chat._id, messages: chat.messages});

      //Notify All connected host if a chat is added 
      for(let i = 0; i < connectedHosts.length; i++){
          console.log(connectedHosts[i]);
          io.to(connectedHosts[i]).emit("chat added");
      }

      }catch(error){
          console.log(error);
      }
    
    });

    socket.on('chat message',async (msg) => {
      console.log('Message:', msg);

      try{

          const chatMessage = {
              content: msg.message,
              timestamp: new Date(),
              createdBy: msg.sentBy === "user" ? "user" : "host"
            };
          
            await chatModel.findOneAndUpdate({userId: msg.userId}, { $push: { messages: chatMessage } });
    
            //Notify user and host in a room that a message is added
            io.to(msg.userId.toString()).emit('chat received', {createdBy: msg.sentBy, message: msg.message});

      }catch(error){
          console.log(error);
      }
    
    });

  socket.on('host connect',() => {
      console.log('host connected');
      //Store the currently connected hosts
      connectedHosts.push(socket.id);
  });  

  socket.on('host disconnect', () => {
      console.log('Host disconnected');
      //Remove the disconnected host from connect hosts array
      const index = connectedHosts.indexOf(socket);
      if (index !== -1) {
        connectedHosts.splice(index, 1);
      }
  });

  socket.on('join chat', (hostData) => {
      console.log('Host joined the chat:', hostData);

      try{
          const userId = hostData._id.toString();
    
          //join a room or chat started by user
          socket.join(userId);
      }catch(error){
          console.log(error);
      }
    
  });

  socket.on('leave chat', (hostData) => {
      console.log('Host leave the chat:', hostData);

      try{
          const userId = hostData._id.toString();

          //leave the user room
          socket.leave(userId, function (err) {
              console.log(err);
          });
      }catch(error){
          console.log(error);
      }
    });
 
    
  });
};
