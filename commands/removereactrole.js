const { SlashCommandBuilder } = require('@discordjs/builders');
const elevation = require("../helpers/elevation_check");
const fs = require('fs');
const config = require('../config.json');

class RemoveReactRole {
    constructor() { }
    command() {
        const api_command = new SlashCommandBuilder().setName("removereactrole")
            .setDescription("Adds a role to a user automatically when a specific is reaction is added to a message")
            .addChannelOption(option => option.setName("channel").setDescription("The channel the message resides").setRequired(true))
            .addStringOption(option => option.setName("messageid").setDescription("The ID of the message to watch").setRequired(true))
            .addRoleOption(option => option.setName("role").setDescription("The role to add upon reaction").setRequired(true))
            .addStringOption(option => option.setName("reaction").setDescription("The reaction to respond to").setRequired(true))
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName === 'removereactrole') {
            if (elevation.isElevated(interaction.member)) {
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

                    var realReactions = await realMessage.reactions.resolve(reaction);
                    realReactions.remove(config.client_id);

                    if (json_roles.reactroles.includes(JSON.stringify(new_reaction))) {
                        const indexOfReactRole = json_roles.reactroles.indexOf(`${JSON.stringify(new_reaction)}`);
                        json_roles.reactroles.splice(indexOfReactRole, 1);
                        fs.writeFileSync("persistent/reactroles.json", JSON.stringify(json_roles));
                        return await interaction.reply("Succesfully removed auto-role!")
                    } else {
                        return await interaction.reply("That react/role combo does not exist for that message.");
                    }
                }
            } else {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_removereactrole = new RemoveReactRole();

module.exports = inst_removereactrole;
