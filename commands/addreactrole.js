const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

class AddReactRole {
    constructor() {}
    command() {
        const api_command = new SlashCommandBuilder().setName("addreactrole")
        .setDescription("Adds a role to a user automatically when a specific is reaction is added to a message")
        .addChannelOption(option => option.setName("channel").setDescription("The channel the message resides").setRequired(true))
        .addStringOption(option => option.setName("messageid").setDescription("The ID of the message to watch").setRequired(true))
        .addRoleOption(option => option.setName("role").setDescription("The role to add upon reaction").setRequired(true))
        .addStringOption(option => option.setName("reaction").setDescription("The reaction to respond to").setRequired(true))
        return api_command;
    }
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        if(interaction.commandName === 'addreactrole') {
            const channel = interaction.options.getChannel('channel');
            const message_id = interaction.options.getString('messageid');
            const role = interaction.options.getRole('role');
            const reaction = interaction.options.getString('reaction');

            var realMessage = await channel.messages.fetch(message_id);
            if (!realMessage) {
                return await interaction.reply("The message ID specified does not exist in that channel!");
            } else {
                const json_roles = JSON.parse(fs.readFileSync("persistent/reactroles.json"));
                const new_reaction = {
                    "message_id": message_id,
                    "role_id": role.id,
                    "reaction_id": reaction
                }

                if (json_roles.reactroles.includes(JSON.stringify(new_reaction))) {
                    return await interaction.reply("That react/role combo already exists for that message.");
                }

                realMessage.react(reaction);
                
                json_roles.reactroles.push(JSON.stringify(new_reaction));
                fs.writeFileSync("persistent/reactroles.json", JSON.stringify(json_roles));
                return await interaction.reply("Succesfully added auto-role!")
            }
        }
    };
}

inst_addreactrole = new AddReactRole();

module.exports = inst_addreactrole;
