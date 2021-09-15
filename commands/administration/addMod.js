const { Client, CommandInteraction } = require("discord.js");
const { roleMention } = require('@discordjs/builders');
const { isStaff, isMod } = require("../../handlers/accessControl");

module.exports = {
    name: "addmod",
    description: "Adds a moderation role to the database",
    options: [
        {
            name: "role",
            description: "The role to add as a moderation role.",
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
            interaction.followUp({ content: `Silly Rabbit! Only moderators+ can run this command!`, ephemeral:true});
            return;    
        }

        const mentionRole = roleMention(args[0]);
        let moderationRoles = await client.db.get("moderationRoles");
        if (!moderationRoles) {
            moderationRoles = [`${args[0]}`]
            client.db.set("moderationRoles", moderationRoles);
            await interaction.followUp({ content: `${mentionRole} has been added as a moderation role.`});
        } else {
            for (let role of moderationRoles) {
                if (role == args[0]) {
                    await interaction.followUp({ content: `${mentionRole} is already a moderation role.`});
                    return;
                }
            }
            moderationRoles.push(args[0]);
            client.db.set("moderationRoles", moderationRoles);
            await interaction.followUp({ content: `${mentionRole} has been added as a moderation role.`});
        }
    }
};
