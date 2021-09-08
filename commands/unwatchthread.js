const { SlashCommandBuilder } = require('@discordjs/builders');
const { isElevated } = require('../helpers/elevation_check');
const fs = require('fs');

class UnWatchThread {
    constructor() { }
    command() {
        const api_command = new SlashCommandBuilder().setName("unwatchthread")
            .setDescription("Removes a thread from the permathread watch list.")
            .addChannelOption(option => option.setName("thread").setDescription("The thread to unwatch").setRequired(true));
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName === 'unwatchthread') {
            if (await isElevated(interaction.member)) {
                const thread = interaction.options.getChannel('thread');
                if (thread.isThread()) {
                    const json_threads = JSON.parse(fs.readFileSync("persistent/permathreads.json"));
                    if (!json_threads.threads.includes(`${thread.id}`)) {
                        return await interaction.reply(`${thread.name} is not being watched!`);
                    } else {
                        const indexOfThread = json_threads.threads.indexOf(`${thread.id}`);
                        json_threads.threads.splice(indexOfThread, 1);
                        fs.writeFileSync("persistent/permathreads.json", JSON.stringify(json_threads));
                        return await interaction.reply(`Unwatching the thread: #${thread.name}!`);
                    }

                } else {
                    return await interaction.reply("Watch Thread is for threads silly rabit!");
                }
            } else {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_unwatch = new UnWatchThread();

module.exports = inst_unwatch;
