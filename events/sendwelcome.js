const fs = require('fs');

class SendWelcome {
    constructor() {
        console.log("PLUGIN: WELCOME MODULE ENABLED")
    }
    async execute(member) {
        const json_welcome = JSON.parse(fs.readFileSync("persistent/welcome.json"));
        const welcomeon = json_welcome.welcomeon[0];
        const welcomechannel =  client.channels.get(json_welcome.welcomechannel[0]);
        const welcomemessage = json_welcome.welcomemessage[0];
        //Send the welcome message
        console.log("SendWelcome");
        if(welcomeon)
        {
            console.log("message sent?");
            await welcomechannel.send(welcomemessage);
            //Delete the welcome
            if(deleteon)
            {

            }
        }
        
    }
}

inst_sendwelcome = new SendWelcome();
module.exports = inst_sendwelcome;