const { Client, CommandInteraction } = require("discord.js");
const { channelMention, roleMention } = require('@discordjs/builders');
const { isStaff, isMod } = require("../../handlers/accessControl");

module.exports = {
    name: "removereactrole",
    description: "Removes a reaction role from a message",
    options: [
        {
            name: "channel",
            description: "The channel the message resides in.",
            type: "CHANNEL",
            required: true        
        },
        {
            name: "messageid",
            description: "The message used for reactions.",
            type: "STRING",
            required: true
        },
        {
            name: "reaction",
            description: "The reaction that was used to assign the role.",
            type: "STRING",
            required: true
        },
        {
            name: "role",
            description: "The role that was added.",
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
            interaction.followUp({ content: `Silly Rabbit! Only administrators can run this command!`, ephemeral: true });
            return;
        }
        
        const mentionChannel = channelMention(args[0]);
        const mentionRole = roleMention(args[3]);
        const channelArg = await interaction.guild.channels.fetch(args[0])
        const messageArg = await channelArg.messages.fetch(args[1]).catch(x => undefined);
        if (messageArg) {
            const reactionRole = {
                "messageid": args[1],
                "reaction": args[2],
                "role": args[3]
            }

            let reactionRoles = await client.db.get("reactionRoles");
            if (!reactionRoles) {
                await interaction.followUp({ content: `A react role for ${mentionRole} does not exist with a ${args[2]} reaction.`});
                return;
            } else {
                for (let role of reactionRoles) {
                    if (role.messageid == reactionRole.messageid && role.reaction == reactionRole.reaction && role.role == reactionRole.role) {
                        const roleLocation = reactionRoles.indexOf(role);
                        reactionRoles.splice(roleLocation, 1);
                        const reaction = messageArg.reactions.resolve(args[2]);
                        if (reaction) {
                            reaction.remove();
                        }
                        client.db.set("reactionRoles", reactionRoles);
                        await interaction.followUp({ content: `The react role combo for ${mentionRole} and ${args[2]} has been removed.`});
                        return;
                    }
                }
                await interaction.followUp({ content: `A react role for ${mentionRole} does not exist with a ${args[2]} reaction.`});
                return;
            }
        } else {
            interaction.followUp(`The message id provided does not exist in ${mentionChannel}`);
        }
    }
};
