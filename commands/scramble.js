/*const { SlashCommandBuilder } = require('@discordjs/builders');
const { isStaff } = require('../helpers/elevation_check');
const fs = require('fs');

class scrambler {
    constructor() {}
    command() {
        const api_command = new SlashCommandBuilder().setName("scramble")
        .setDescription("Scrambles all text entered after command")
        return api_command;
    }
    async execute(interaction) {
        if(interaction.commandName === 'scramble'){
            
        }
    }
}
*/

//possible main code but ill most likely need to merge above code with this code.
const Jumble = require(*jumble-words*);
const jumble = new Jumble();

module.exports.run = (client, message, args) => {
  const word = jumble.generate();
  const filter = m => m.author.id === message.author.id;

  console.log(word);
  await message.channel.send('Your word is **${word[0].jumble}**!');
  message.channel.awaitMessages(filter, {
    
  })
}

module.exports.help = {
  name: "jumble"
};


/*shuffle(str) {
    var str = document.getElementById('txt');
    var a = str.innerHTML;
    var newArr = [];
    var neww = '';
    var text = a.replace(/[\r\n]/g, '').split(' ');
    
    text.map(function(v) {
      v.split('').map(function() {
        var hash = Math.floor(Math.random() * v.length);
        neww += v[hash];
        v = v.replace(v.charAt(hash), '');
      });
      newArr.push(neww);
      neww = '';
    });
    var x = newArr.map(v => v.split('').join(' ')).join('\n');
    str.value = x.split('').map(v => v.toUpperCase()).join('');
  }*/