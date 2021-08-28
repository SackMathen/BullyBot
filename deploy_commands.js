const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { client_id, guild_id, access_token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('bbtoggleforcerules').setDescription('Enables/Disables forced rule reading. Turning this off results in auto-roleing.'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(access_token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(client_id, guild_id),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();