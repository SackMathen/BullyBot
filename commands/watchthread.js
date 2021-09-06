const { SlashCommandBuilder } = require('@discordjs/builders');
const elevation = require("../helpers/elevation_check");
const fs = require('fs');

class WatchThread {
    constructor() { }
    command() {
        const api_command = new SlashCommandBuilder().setName("watchthread")
            .setDescription("Adds a thread to the permathread watch list.")
            .addChannelOption(option => option.setName("thread").setDescription("The thread to watch").setRequired(true));
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName === 'watchthread') {
            if (elevation.isElevated(interaction.member)) {
                const thread = interaction.options.getChannel('thread');
                if (thread.isThread()) {
                    const json_threads = JSON.parse(fs.readFileSync("persistent/permathreads.json"));
                    json_threads.threads.push(thread.id);
                    fs.writeFileSync("persistent/permathreads.json", JSON.stringify(json_threads));
                    return await interaction.reply(`Now watching the thread: ${thread.name}!`);
                } else {
                    return await interaction.reply("Watch Thread is for threads silly rabit!");
                }
            } else {
                return await interaction.reply("Only moderators and administrators can use this command!");
            }
        }
    };
}

inst_watch = new WatchThread();

module.exports = inst_watch;
