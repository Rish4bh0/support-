const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const wwebVersion = '2.2407.3';  
const {
    startController,
    //clientUser,
   // choseClientUser,
   // newUser,
   // choseNewUser,
   // aboutUs,
   // choseAboutUs,
  //  contact,
   // choseContact,
  } = require('./controllers');

  //const {
 // resultClientUser,
 // orderClienteUser,
//  downloadNoteClienteUser
//} = require('./src/controllers/modules');

//const join = require('./src/events/event.join');
//const left = require('./src/events/event.left');


const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    },
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', }
})

whatsappClient.on("qr", (qr) => qrcode.generate(qr, { small: true}))
whatsappClient.on("ready", () => console.log("WhatsApp bot successfully connected!"))

whatsappClient.on('message', async (msg) => {
    const message = msg.body.toLowerCase();
    console.log('MESSAGE RECEIVED', msg);
})
  /*
    if (
      message == '.t' ||
      message == '0' ||
      message == 'back' ||
      message == 'start'
      
    ) {
      await startController(msg);
    } else if (whatsappClient.lastMessage == 'start') {
      switch (msg.body) {
        case '1':
          await clientUser(msg);
          break;
        case '2':
          await newUser(msg);
          break;
        case '3':
          await aboutUs(msg);
          break;
        case '4':
          await contact(msg);
          break;
        default:
            whatsappClient.setPrevMessage('start');
            whatsappClient.sendMessage(
            msg.from,
            '⚠️ Invalid option, shall we try again? type * BACK * '
          );
      }
    } else if (whatsappClient.lastMessage == 'clientUser') {
      await choseClientUser(msg);
    } else if (whatsappClient.lastMessage == 'result') {
      await resultClientUser(msg);
    } else if (whatsappClient.lastMessage == 'descriptionOrder') {
      await orderClienteUser(msg); 
    } else if (whatsappClient.lastMessage == 'downloadNote') {
      await downloadNoteClienteUser(msg);  
    } else if (whatsappClient.lastMessage == 'newUser') {
      await choseNewUser(msg);
    } else if (whatsappClient.lastMessage == 'aboutUs') {
      await choseAboutUs(msg);
    } else if (whatsappClient.lastMessage == 'contact') {
      await choseContact(msg);
    } else {
        whatsappClient.setPrevMessage('start');
        whatsappClient.sendMessage(
        msg.from,
        'OPSS! 😅 I apologize. the more you typed something invalid, type *START* '
      );
    }
  });
  */
  //client.on('group_join', join);
  //client.on('group_leave', left);


/*

whatsappClient.on("message", async (msg) => {
    try {
        if (msg.isGroupMsg) {
            // Message is from a group
            const groupName = msg.getChat().name;
            const sender = await msg.getContact();
            const senderName = sender.name;
            const messageContent = msg.body;

            console.log(`Received message in group ${groupName} from ${senderName}: ${messageContent}`);

            // Respond to group messages
            if (messageContent.includes('hello')) {
                // Reply to the entire group
                await whatsappClient.sendText(msg.from, 'Hello!');
            }
            
        } else {

            if (msg.body.includes('.ticket')) {
               // await   msg.reply('Hello how can i help you');
               await  whatsappClient.sendMessage(
                    msg.from,
                    '\n\nHello Im Hyper, your *virtual assistant* at *Dryice* 😄' +
                    '\n\nI have selected below the main subjects that you usually ask me, *type the number* corresponding to the desired option.' +
                    '\n\n*1* - I am already a customer at *Dryice* and want to request support' +
                    '\n*2* - I am not yet a customer at *Dryice* and want to request support' +
                    '\n*3* - Find out more about *Dryice*' +
                    '\n*4* - Contacts'
                  );
            } else if (msg.body.includes('description') || msg.body.includes('Description')) {
                await msg.reply('Your ticket has been acknowledged.');
            } else if (msg.body.includes('bye')) {
                await msg.reply('Goodbye! Take care.');
            }
            // Message is from an individual contact
            const contact = await msg.getContact();
            const contactName = contact.name;
            const messageContent = msg.body;

            console.log(`Received message from ${contactName}: ${messageContent}`);

            // Respond to individual messages
            // Add your logic here
            
        }
        
    } catch (error) {
        console.error("Error handling message:", error);
    }
});

/*
whatsappClient.on("message", async (msg) => {
    try {



        // Respond to specific messages
        if (msg.body.includes('hello')) {
            await msg.reply('Hello! How can I assist you?');
        } else if (msg.body.includes('bye')) {
            await msg.reply('Goodbye! Take care.');
        }
       
        if(msg.from !== "status@broadcast") {
            const contact = await msg.getContact();
            console.log(contact, msg.body);
           
        }
    } catch (error) {
        console.log(error);
    }
});
*/

//whatsappClient.initialize()



module.exports = whatsappClient;