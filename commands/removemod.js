const { SlashCommandBuilder } = require('@discordjs/builders');
const elevation = require("../helpers/elevation_check");
const fs = require('fs');

class RemoveMod {
    constructor() { }
    command() {
        const api_command = new SlashCommandBuilder().setName("removemod")
            .setDescription("Removes a role from the moderator list.")
            .addRoleOption(option => option.setName("role").setDescription("The role to remove").setRequired(true));
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName === 'removemod') {
            if (elevation.isStaff(interaction.member)) {
                const role = interaction.options.getRole('role');
                const json_mods = JSON.parse(fs.readFileSync("persistent/moderators.json"));
                if (json_mods.mods.includes(`${role.id}`)) {
                    const indexOfModRole = json_mods.mods.indexOf(`${role.id}`);
                    json_mods.mods.splice(indexOfModRole, 1);
                    fs.writeFileSync("persistent/moderators.json", JSON.stringify(json_mods));
                    return await interaction.reply(`${role.name} has been removed from the moderator list!`);
                } else {
                    return await interaction.reply(`${role.name} is not on the moderator list!`);
                }
            } else {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_removemod = new RemoveMod();

module.exports = inst_removemod;
