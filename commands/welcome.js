const { SlashCommandBuilder } = require('@discordjs/builders');
const { isElevated } = require("../helpers/elevation_check");
const fs = require('fs');

class Welcome
{
    constructor() { }
    command()
    {
        //Build the command w/ all its fields for discord
        const api_command = new SlashCommandBuilder().setName("welcome")
            .setDescription("Manages the welcome message configuration for this server.")
            .addIntegerOption(option => option.setName("subcommand").setDescription("The branch of the welcome command you wish to activate").setRequired(true).addChoice("Toggle Send", 0).addChoice("Toggle Delete", 1).addChoice("Set Channel", 2).addChoice("Edit Message", 3))
            .addStringOption(option => option.setName("welcomemessage").setDescription("The welcome message to be sent when a user joins").setRequired(false))
            .addChannelOption(option => option.setName("channel").setDescription("The channel to send welcome messages to").setRequired(false));
        return api_command;
    }
    async execute(interaction) 
    {
        if (interaction.commandName === 'welcome')
        {
            if (isElevated(interaction.member))
            {
                const subcommand = interaction.options.getInteger('subcommand');
                const inmessage = interaction.options.getString('welcomemessage');
                const inchannel = interaction.options.getChannel('channel');
                //Parse welcome.json into an array
                const json_welcome = JSON.parse(fs.readFileSync("persistent/welcome.json"));
                switch(subcommand)
                {
                    //Toggle Send
                    case 0:
                        json_welcome.welcomeon[0] = !json_welcome.welcomeon[0];
                        fs.writeFileSync("persistent/welcome.json", JSON.stringify(json_welcome));
                        return await interaction.reply(`Welcome message is now ${json_welcome.welcomeon[0] ? "on!" : "off!"}!`);
                    //Toggle Delete
                    case 1:
                        json_welcome.deleteon[0] = !json_welcome.deleteon[0];
                        fs.writeFileSync("persistent/welcome.json", JSON.stringify(json_welcome));
                        return await interaction.reply(`Welcome message is now ${json_welcome.deleteon[0] ? "on!" : "off!"}!`);
                    //Set Channel
                    case 2:
                        json_welcome.welcomechannel[0] = inchannel.id;
                        fs.writeFileSync("persistent/welcome.json", JSON.stringify(json_welcome));
                        return await interaction.reply(`Now welcoming people to the channel: ${inchannel.name}!`);
                    
                    //Edit Message
                    case 3:
                        json_welcome.welcomemessage[0] = inmessage;
                        fs.writeFileSync("persistent/welcome.json", JSON.stringify(json_welcome));
                        return await interaction.reply(`Now using a new welcome message!`);
                }
            }
            else
            {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_welcome = new Welcome();

module.exports = inst_welcome;
