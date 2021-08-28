//The imports
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const { client_id, guild_id, access_token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const api_commands = [];

//Iterates through all .js files in dir /commands/, adds them to list of bot commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command_file = require(`./commands/${file}`);
    for(const command of command_file.data) {
        api_commands.push(command.toJSON()); //push to discord autocomplete
        client.commands.set(command.name, command_file); //push to bot
    }
}

// Using the Discord API push it to the Discord Server
const rest = new REST({ version: '9' }).setToken(access_token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(client_id, guild_id),
			{ body: api_commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.once('ready', () => {
	console.log('Ready!');
});

//Ignore non-commands, or look up actual commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
        await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(access_token);