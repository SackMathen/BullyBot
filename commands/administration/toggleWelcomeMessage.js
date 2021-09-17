const { Client, CommandInteraction } = require("discord.js");
const { isStaff } = require("../../handlers/accessControl");

module.exports = {
    name: "togglewelcome",
    description: "Toggles the welcome message off/on.",
    options: [],
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
        
        let welcomeStatus = await client.db.get("welcomeMessageEnabled");
        let welcomeMessage = await client.db.get("welcomeMessage");
        if (!welcomeMessage) {
            await interaction.followUp("You must set a welcome message with /setWelcomeMessage before running this command.");
            return;
        }

        if (!welcomeStatus) {
            welcomeStatus = true;
            client.db.set("welcomeMessageEnabled", welcomeStatus);
            await interaction.followUp("Welcome Message has been enabled!");
        } else {
            client.db.set("welcomeMessageEnabled", welcomeStatus);
            await interaction.followUp("Welcome Message has been disabled!");
        }
    }
};
