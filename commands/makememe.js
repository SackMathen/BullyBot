const { SlashCommandBuilder } = require('@discordjs/builders');
const meme_engine = require('../helpers/meme_engine');
const fs = require('fs');
const current_memes = JSON.parse(fs.readFileSync("persistent/memegen.json"));

class MakeMeme {
    constructor() { }
    command() {
        // Tracks number of pages
        let meme_pages = 0;

        // Create our base command
        const api_command = new SlashCommandBuilder().setName(`makememe`).setDescription("Generates a meme dynamically");

        // Keep making subcommands until there are no memes left
        while (current_memes.memes.length != 0) {
            // Make a new subcommand
            api_command.addSubcommand(subcommand => {
                // Set the sub commands details equal to its numerical order (starts with 1 then increments)
                subcommand.setName(`page${meme_pages + 1}`).setDescription(`Page ${meme_pages + 1} of memes`)

                // Add the memes as a string option
                subcommand.addStringOption(option => {
                    // Set option name (for the string option)
                    option.setName("meme").setDescription("The name of the meme").setRequired(true);

                    // We can have 25 choices so we stop at 24 (0 to 24 == 25)
                    let meme_options = 0;
                    while (meme_options != 24 && current_memes.memes.length != 0) {

                        // Parse Current Meme
                        let meme_data = JSON.parse(current_memes.memes[0]);
                        
                        // Throw it out if it has more than 2 text boxes
                        if (meme_data.box_count > 2 || meme_data.box_count < 2) {
                            console.log("I'm lazy! You have to have two text boxes for now!"); //Farrar being lazy and only implementing 2 text boxes, though you could just make them all optional and give them the max amount of fields :p
                            current_memes.memes.splice(0, 1);
                            meme_options++;
                            continue;
                        }

                        // Add the choice (shows as name in the list, returns id in our parsing)
                        option.addChoice(meme_data.name, meme_data.id)

                        // Remove the meme
                        current_memes.memes.splice(0, 1);

                        // Increment
                        meme_options++;
                    }

                    return option;
                })

                // Meme Text Options
                subcommand.addStringOption(option => option.setName("textboxone").setDescription("top text"));
                subcommand.addStringOption(option => option.setName("textboxtwo").setDescription("bottom text"));
                return subcommand;
            })
            // Page done, Increment
            meme_pages++;
        };
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName.includes("makememe")) {
            var meme_id = interaction.options.getString('meme');
            var box_1 = interaction.options.getString("textboxone") || "";
            var box_2 = interaction.options.getString("textboxtwo") || "";
            // Yes this hardcoded. Fight me
            box_1 = box_1 == '0' ? "O" : box_1;
            box_2 = box_2 == '0' ? "O" : box_2;

            var img_url = await meme_engine.getMeme(meme_id, [box_1, box_2]);
            if (img_url) {
                return await interaction.reply(img_url);
            } else {
                return await interaction.reply({ content: "Oh no, looks like your meme got lost along the way! (This usually means you didn't provide enough inputs)", ephemeral: true });
            }
        } else {
            return false;
        }
    };
}

inst_makememe = new MakeMeme();

module.exports = inst_makememe;
