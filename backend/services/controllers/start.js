const { whatsappClient } = require('../WhatsappClient');

module.exports = async (msg) => {
  const chat = await msg.getChat();
  chat.sendStateTyping();
  whatsappClient.setPrevMessage('start');

  whatsappClient.sendMessage(
    msg.from,
    '\n\nHello Im Hyper, your *virtual assistant* at *Dryice support desk* 😄' +
    '\n\nI have selected below the main subjects that usually gets asked, *type the number* corresponding to the desired option.' +
    '\n\n*1* - I am already a customer at *Dryice* and I want to create ticket' +
    '\n*2* - I am not yet a customer at *Dryice*' +
    '\n*3* - Find out more about *Dryice*' +
    '\n*4* - Contacts'
  );
};