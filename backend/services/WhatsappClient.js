const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const wwebVersion = '2.2407.3';

const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
})

whatsappClient.on("qr", (qr) => qrcode.generate(qr, { small: true}))
whatsappClient.on("ready", () => console.log("client is ready"))

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
                await msg.reply('Hello! Please fill in the following details name, email, title and short description');
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

module.exports = whatsappClient;