const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

class UnWatchThread {
    constructor() {}
    command() {
        const api_command = new SlashCommandBuilder().setName("unwatchthread")
        .setDescription("Removes a thread from the permathread watch list.")
        .addChannelOption(option => option.setName("thread").setDescription("The thread to unwatch").setRequired(true));
        return api_command;
    }
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === 'unwatchthread') {
            const thread = interaction.options.getChannel('thread');
            if (thread.isThread()) {
                const json_threads = JSON.parse(fs.readFileSync("persistent/permathreads.json"));
                if (!json_threads.threads.includes(`${thread.id}`)) {
                    await interaction.reply(`${thread.name} is not being watched!`);
                } else {
                    const indexOfThread = json_threads.threads.indexOf(`${thread.id}`);
                    json_threads.threads.splice(indexOfThread, 1);
                    await interaction.reply(`Unwatching the thread: #${thread.name}!`);
                    fs.writeFileSync("persistent/permathreads.json", JSON.stringify(json_threads));
                }

            } else {
                await interaction.reply("Watch Thread is for threads silly rabit!");
            }
        }
    };
}

inst_unwatch = new UnWatchThread();

module.exports = inst_unwatch;