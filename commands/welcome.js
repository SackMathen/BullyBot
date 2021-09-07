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
            .addIntegerOption(option => option.setName("subcommand").setDescription("The branch of the welcome command you wish to activate").setRequired(true).addChoice("Toggle Enable", 0).addChoice("Set Channel", 1).addChoice("Edit Message", 2))
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
                const welcomemessage = interaction.options.getString('welcomemessage');
                const channel = interaction.options.getChannel('channel');
                switch(subcommand)
                {
                    //Toggle Enable
                    case 0:
                        break;
                    //Set Channel
                    case 1:
                        const json_welcome = JSON.parse(fs.readFileSync("persistent/welcome.json"));
                        json_welcome.threads.push(thread.id);
                        fs.writeFileSync("persistent/permathreads.json", JSON.stringify(json_threads));
                        return await interaction.reply(`Now watching the thread: ${thread.name}!`);
                        break;
                    
                    //Edit Message
                    case 2:
                        break;
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
