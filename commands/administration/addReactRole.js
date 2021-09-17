const { Client, CommandInteraction } = require("discord.js");
const { channelMention, roleMention } = require('@discordjs/builders');
const { isStaff, isMod } = require("../../handlers/accessControl");

module.exports = {
    name: "addreactrole",
    description: "Adds a reaction role to a message",
    options: [
        {
            name: "channel",
            description: "The channel the message resides in.",
            type: "CHANNEL",
            required: true        
        },
        {
            name: "messageid",
            description: "The message to monitor for reactions.",
            type: "STRING",
            required: true
        },
        {
            name: "reaction",
            description: "The reaction to assign the role to.",
            type: "STRING",
            required: true
        },
        {
            name: "role",
            description: "The role to add to the reactor.",
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
                reactionRoles = [ reactionRole ];
                client.db.set("reactionRoles", reactionRoles);
                await interaction.followUp({ content: `${mentionRole} will now be added when a ${args[2]} reaction is added.`});
                return;
            } else {
                for (let role of reactionRoles) {
                    if (role.messageid == reactionRole.messageid && role.reaction == reactionRole.reaction && role.role == reactionRole.role) {
                        await interaction.followUp({ content: `A react role combo already exists for ${mentionRole} and ${args[2]} on that message.`});
                        return;
                    }
                }
                reactionRoles.push(reactionRole);
                client.db.set("reactionRoles", reactionRoles);
                await messageArg.react(args[2]);
                await interaction.followUp({ content: `${mentionRole} will now be added when a ${args[2]} reaction is added.`});
                return;
            }
        } else {
            interaction.followUp(`The message id provided does not exist in ${mentionChannel}`);
        }
    }
};
