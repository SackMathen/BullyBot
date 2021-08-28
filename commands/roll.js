// Demo File
const { SlashCommandBuilder } = require('@discordjs/builders');

class Roll {
    #RollEnabled = true
    data = null

    constructor() {
        this.#RollEnabled = true;
        this.data = [new SlashCommandBuilder().setName("roll").setDescription("rolls a six sided die"),
                     new SlashCommandBuilder().setName("toggleroll").setDescription("toggles roll on or off")]
    }

    async execute(interaction) {
        const cmd = interaction.commandName;
        if (cmd == "toggleroll") {
            this.#RollEnabled = !this.#RollEnabled;
            var status = this.#RollEnabled ? "enabled!" :  "disabled!";
            interaction.reply("Roll is now " + status);
        } else if (cmd == "roll" && this.#RollEnabled) {
            return interaction.reply("You rolled a " + String(Math.floor((Math.random() * 6) + 1)) + "!");
        } else {
            await interaction.reply("If you see this... you've entered the matrix!");
            return interaction.deleteReply();
        }
    }
}

inst_roll = new Roll();

module.exports = inst_roll;