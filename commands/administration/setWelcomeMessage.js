const { Client, CommandInteraction } = require("discord.js");
const { isStaff } = require("../../handlers/accessControl");

module.exports = {
    name: "setwelcome",
    description: "Sets the welcome message.",
    options: [
        {
            name: "message",
            description: "The welcome message.",
            type: "STRING",
            required: true     
        },
        {
            name: "channel",
            description: "The channel to welcome users in.",
            type: "CHANNEL",
            required: true
        }
    ],
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!await isStaff(interaction)) {
            interaction.followUp({ content: `Silly Rabbit! Only administrators can run this command!`, ephemeral:true});
            return;    
        }

        let welcomeMessage = await client.db.get("welcomeMessage");
        let welcomeContent = {
            "message": args[0],
            "channel": args[1]
        }
        client.db.set("welcomeMessage", welcomeMessage);
        interaction.followUp(`Welcome message set to: ${welcomeContent.message} in ${welcomeContent.channel}`);
    }
};
