import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const ChatPage = () => {
    const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const socket = io('https://dryicesupport.onrender.com');
   
    const chatButton = document.createElement('div');
    chatButton.id = 'chat-button';
    chatButton.innerHTML = '&#9993;';
    document.body.appendChild(chatButton);

    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.innerHTML = `
      <div id="chat-header">
        <div id="header-text">Chat with Us</div>
        <div id="close-button">&#10006;</div>
      </div>
      <div id="chat-form">
        <form id="start-chat-form">
          
          <button type="submit">Start Chat</button>
        </form>
      </div>
      <div id="message-section" style="display: none;">
        <div id="chat-messages"></div>
        <input type="text" id="message-input" placeholder="Type your message...">
        <button id="send-button">Send</button>
      </div>
    `;

   { /*
    

    
  */}
    document.body.appendChild(chatWidget);

    chatWidget.style.display = 'none';

    chatButton.addEventListener('click', function () {
      chatButton.style.display = 'none';
      chatWidget.style.display = 'block';
    });

    document.getElementById('close-button').addEventListener('click', function () {
      chatWidget.style.display = 'none';
      chatButton.style.display = 'block';
    });

    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const startChatForm = document.getElementById('start-chat-form');
    const messageSection = document.getElementById('message-section');

    let messages = [];
    let userId = "";
    let chatId = "";

    socket.on('chat initialized', (data) => {
      messages = [...data.messages];
      userId = data.userId;
      chatId = data.chatId;
      for (const entry of messages) {
        appendMessage(entry.createdBy === "user" ? "You" : "Support", entry.content, entry.createdBy);
      }
    });

    socket.on('chat received', (msg) => {
      appendMessage(msg.createdBy === "user" ? "You" : "Support", msg.message, msg.createdBy);
    });

    function appendMessage(user, message, sender) {
      const newMessage = document.createElement('div');
      newMessage.className = 'message';
      
      if (sender === 'system' || sender === "host") {
        newMessage.classList.add('system-message');
      } else if (sender === "user") {
        newMessage.classList.add('user-message');
      }

      newMessage.innerHTML = `<strong>${user}:</strong> ${message}`;
      chatMessages.appendChild(newMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
      const message = messageInput.value.trim();
      if (message !== '') {
        socket.emit('chat message', { message, userId: userId, chatId: chatId, sentBy: "user"});
        messageInput.value = '';
      }
    }

    function startChat(event) {
      event.preventDefault();
      const { name, email } = user; // Retrieve name, email, and _id from userData
      const phone = user._id;

      if (name && email && phone) {
        appendMessage('System', `Welcome, ${name}! The chat will start shortly.`, 'system');
        socket.emit('start chat', { name, email, phone });
        chatWidget.removeChild(document.getElementById('chat-form'));
        messageSection.style.display = 'block';
      } else {
        alert('Please provide all necessary information.');
      }
    }

    sendButton.addEventListener('click', sendMessage);
    startChatForm.addEventListener('submit', startChat);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // External CSS styles
  const externalStyles = `
    #chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #1b3dc5;
      color: white;
      font-size: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
    }

    #chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Arial', sans-serif;
      display: flex;
      flex-direction: column;
      background-color: white; /* Added background color */
    }

    #chat-header {
      background-color: #1b3dc5;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #header-text {
      font-size: 16px;
      font-weight: bold;
    }

    #close-button {
      font-size: 18px;
      cursor: pointer;
    }

    #close-button:hover {
      color: #fff;
    }

    #chat-messages {
      max-height: 200px;
      overflow-y: auto;
      padding: 10px;
      box-sizing: border-box;
    }

    .message {
      margin-bottom: 10px;
    }

    #message-input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: none;
      border-top: 1px solid #ccc;
      font-size: 14px;
    }

    #send-button {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      background-color: #1b3dc5;
      color: white;
      border: none;
      border-radius: 0 0 5px 5px;
      cursor: pointer;
      font-size: 14px;
    }

    #send-button:hover {
      background-color: #1836af;
    }

    #chat-form {
      padding: 10px;
      box-sizing: border-box;
    }

    #start-chat-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #start-chat-form label {
      font-weight: bold;
    }

    #start-chat-form input {
      padding: 8px;
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 10px;
    }

    #start-chat-form button {
      padding: 10px;
      background-color: #1b3dc5;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    #start-chat-form button:hover {
      background-color: #1836af;
    }

    .system-message {
      text-align: left;
      color: #555;
    }

    .user-message {
      text-align: right;
      color: #333;
    }
  `;

  return (
    <style>
      {externalStyles}
    </style>
  );
};

export default ChatPage;
