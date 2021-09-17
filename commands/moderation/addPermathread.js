const { Client, CommandInteraction } = require("discord.js");
const { channelMention } = require('@discordjs/builders');
const { isStaff, isMod } = require("../../handlers/accessControl");

module.exports = {
    name: "addpermathread",
    description: "Adds a thread to the permathread database",
    options: [
        {
            name: "thread",
            description: "The thread to add as a permathread.",
            type: "CHANNEL",
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
        if (!await isMod(client, interaction)) {
            interaction.followUp({ content: `Silly Rabbit! Only moderators+ can run this command!`, ephemeral:true});
            return;    
        }

        const channelIsThread = (await interaction.guild.channels.fetchActiveThreads()).threads.has(args[0]);
        const mentionChannel = channelMention(args[0]);
        if (channelIsThread) {
            let permathreads = await client.db.get("permaThreads");
            if (!permathreads) {
                permathreads = [`${args[0]}`]
                client.db.set("permaThreads", permathreads);
                await interaction.followUp({ content: `${mentionChannel} has been added to the permathread list.`});
                return;
            }
            
            // Check if it already exists
            if (permathreads.includes(args[0])) {
                await interaction.followUp({ content: `${mentionChannel} is already in the permathread list.`});
                return;
            } else {
                permathreads.push(args[0]);
                client.db.set("permaThreads", permathreads);
                await interaction.followUp({ content: `${mentionChannel} has been added to the permathread list.`});
                return;
            }
        } else {
            await interaction.followUp({ content: `${mentionChannel} is not a valid thread.`});
            return;
        }
    }
};
