const client = require("../index");

client.on('guildMemberAdd', async(member) => {
    let messageEnabled = await client.db.get("welcomeStatus");
    if (!messageEnabled) return;

    let messageContent = await client.db.get("welcomeMessage");
    let welcomeChannel = await client.channels.fetch(messageContent.channel);
    welcomeChannel.send({content:`${messageContent.message}`})
});