const { Client, CommandInteraction } = require("discord.js");
const { roleMention } = require('@discordjs/builders');
const { isStaff } = require("../../handlers/accessControl");

module.exports = {
    name: "removemod",
    description: "Removes a moderation role from the database",
    options: [
        {
            name: "role",
            description: "The role to remove from the moderation role.",
            type: "ROLE",
            required: true
        },
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
            return;
        }

        const mentionRole = roleMention(args[0]);
        let moderationRoles = await client.db.get("moderationRoles");
        if (!moderationRoles) {
            interaction.followUp({ content: `There are no roles set as a moderator.` });
        } else {
            for (const role of moderationRoles) {
                if (role == args[0]) {
                    const index = moderationRoles.indexOf(role);
                    moderationRoles.splice(index, 1);
                    client.db.set("moderationRoles", moderationRoles);
                    await interaction.followUp({ content: `${mentionRole} has been removed as a moderation role.` });
                    return;
                }
            }
        }
        // Key exists, but the role was not found
        interaction.followUp({ content: `${mentionRole} is not a moderation role.` });
    }
};