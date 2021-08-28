// The Roll Plugin
const { SlashCommandBuilder } = require('@discordjs/builders');

class Roll {
    #rollEnabled = true;
    data = null;

    constructor() {
        this.#rollEnabled = true;
        this.data = [new SlashCommandBuilder().setName("roll").setDescription("rolls a six sided die")
                    .addIntegerOption(option => option.setName("size").setDescription("sets the size of the die to be rolled"))
                    .addIntegerOption(option => option.setName("amount").setDescription("sets the amount of dice to be rolled")),
                     new SlashCommandBuilder().setName("toggleroll").setDescription("toggles roll on or off")]
    }

    async execute(interaction) {
        const cmd = interaction.commandName;
        if (cmd == "toggleroll") {
            this.#rollEnabled = !this.#rollEnabled;
            var status = this.#rollEnabled ? "enabled!" :  "disabled!";
            interaction.reply("Roll is now " + status);
        } else if (cmd == "roll" && this.#rollEnabled) {
            var size = interaction.options.getInteger("size");
            var amount = interaction.options.getInteger("amount");
            
            size = (size == undefined ? 6 : size <= 1 ? 6 : size);
            amount = (amount == undefined ? 1 : amount <= 0 ? 1 : amount);

            var out = "";
            if(amount == 1)
            {
                return  interaction.reply("You rolled " + String(Math.floor((Math.random() * size) + 1)) + "!");
            }
            for(let i = 0; i < amount - 1; i++)
            {
                out += (String(Math.floor((Math.random() * size) + 1)) + ", ");
            }
            return interaction.reply("You rolled " + out + " and " + String(Math.floor((Math.random() * size) + 1)) + "!");
        } else {
            await interaction.reply("If you see this... you've entered the matrix!");
            return interaction.deleteReply();
        }
    }
}

inst_roll = new Roll();

module.exports = inst_roll;