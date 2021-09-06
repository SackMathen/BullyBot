const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const { isStaff } = require('../helpers/elevation_check');
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
            if (await isStaff(interaction.member)) {
                const role = interaction.options.getRole('role');
                const json_mods = JSON.parse(fs.readFileSync("persistent/moderators.json"));
                if (json_mods.mods.includes(`${role.id}`)) {
                    return await interaction.reply("That role is already a moderator!");
                } else {
                    json_mods.mods.push(role.id);
                    fs.writeFileSync("persistent/moderators.json", JSON.stringify(json_mods));
                    return await interaction.reply(roleMention(role.name) + " has been added to the moderator list!");          
                }
            } else {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_addmod = new AddMod();

module.exports = inst_addmod;
