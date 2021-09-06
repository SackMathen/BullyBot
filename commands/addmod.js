const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

class AddMod {
    constructor() {}
    command() {
        const api_command = new SlashCommandBuilder().setName("addmod")
        .setDescription("Adds a role to the moderator list")
        .addRoleOption(option => option.setName("role").setDescription("The role to add").setRequired(true));
        return api_command;
    }
    async execute(interaction) {
        if(interaction.commandName === 'addmod') {
            const role = interaction.options.getRole('role');
            const json_mods = JSON.parse(fs.readFileSync("persistent/moderators.json"));
            if (json_mods.mods.includes(`${role.id}`)) {
                return await interaction.reply("That role is already a moderator!");
            } else {
                json_mods.mods.push(role.id);
                fs.writeFileSync("persistent/moderators.json", JSON.stringify(json_mods));     
                return await interaction.reply(`${role.name} has been added to the moderator list!`);          
            }
        }
    };
}

inst_addmod = new AddMod();

module.exports = inst_addmod;
