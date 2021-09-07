const { SlashCommandBuilder } = require('@discordjs/builders');
const meme_engine = require('../helpers/meme_engine');
const fs = require('fs');
const current_memes = JSON.parse(fs.readFileSync("persistent/memegen.json"));

//A function to generate the list of choices for the name of the meme, and associate that with the ID
function choiceGenerator(cmd, option) {
    var meme_choice_count = 0;
    while (meme_choice_count != 24 && current_memes.memes.length != 0) {
        meme_data = JSON.parse(current_memes.memes[0]);
        if (meme_data.box_count > 2 || meme_data.box_count < 2) {
            console.log("I'm lazy! You have to have two text boxes for now!"); //Farrar being lazy and only implementing 2 text boxes, though you could just make them all optional and give them the max amount of fields :p
            current_memes.memes.splice(0, 1);
            meme_choice_count++;
            continue;
        }
        option.addChoice(meme_data.name, meme_data.id)
        current_memes.memes.splice(0, 1);
        meme_choice_count++;
    }
    return option;
}

function setupMemes() {
    var api_commands = [];
    var meme_gen_count = 0; 
    while (current_memes.memes.length != 0) {
        var new_cmd = new SlashCommandBuilder().setName(`makememe${meme_gen_count+1}`).setDescription("Generates a meme dynamically")
        .addStringOption(option => {
            option.setName("meme").setDescription("The name of the meme").setRequired(true);
            return choiceGenerator(new_cmd, option)
        })
        .addStringOption(option => option.setName("textboxone").setDescription("Text to be placed in the first box of the meme").setRequired(false))
        .addStringOption(option => option.setName("textboxtwo").setDescription("Text to be placed in the second box of the meme").setRequired(false));
        api_commands.push(new_cmd);
        meme_gen_count++;
    }
    return api_commands;
}
class MakeMeme {
    constructor() {}
    command() {
        // Slash Command Building
        const api_command = setupMemes();
        return api_command;
    }
    async execute(interaction) {
        if (interaction.commandName.includes("makememe")) {
            var meme_id = interaction.options.getString('meme');
            var box_1 = interaction.options.getString("textboxone") || "";
            var box_2 = interaction.options.getString("textboxtwo") || "";
            
            // Yes this hardcoded. Fight me
            box_1 = box_1=='0' ? " 0 " : box_1; 
            box_2 = box_2=='0' ? " 0 " : box_2;
            
            var img_url = await meme_engine.getMeme(meme_id, [box_1, box_2]);
            if (img_url) {
                return await interaction.reply(img_url);
            } else {
                return await interaction.reply({content:"Oh no, looks like your meme got lost along the way! (This usually means you didn't provide enough inputs)", ephemeral: true});
            }
        } else {
            return false;
        }
    };
}

inst_makememe = new MakeMeme();

module.exports = inst_makememe;
