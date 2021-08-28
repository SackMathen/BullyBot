// Demo File
const { SlashCommandBuilder, italic } = require('@discordjs/builders');

class Ping {
    #PongEnabled = true;
    data = null

    constructor() {
        this.data = [new SlashCommandBuilder().setName("ping").setDescription("replies with pong"), 
                     new SlashCommandBuilder().setName("pong").setDescription("replies with ping"),
                     new SlashCommandBuilder().setName("onlypong").setDescription("disables pong")]
    }

    async execute(interaction) {
        // This worked first try. We have reached god tier programming.
        const cmd = interaction.commandName;
        if (cmd == "onlypong") {
            this.#PongEnabled = false;
            interaction.reply("The bot will now only respond to pings.");
        } else if (cmd == "pong" && this.#PongEnabled) {
                return interaction.reply("Ping");
        } else if ("ping") {
            return interaction.reply("Pong");
        } else {
            await interaction.reply("If you see this... you've entered the matrix!");
            return interaction.deleteReply();
        };
    }
}

inst_ping = new Ping();

module.exports = inst_ping;