// Require the necessary discord.js classes
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Permissions } = require('discord.js');
const fs = require('fs');

// Events
const PermaThreads = require('./events/permathreads');
const ReactRole = require('./events/reactrole');
const ReactUnRole = require('./events/reactunrole');

// Commands
const UnWatchThread = require('./commands/unwatchthread');
const WatchThread = require('./commands/watchthread');
const AddReactRole = require('./commands/addreactrole');
const RemoveReactRole = require('./commands/removereactrole');
const AddMod = require('./commands/addmod');
const RemoveMod = require('./commands/removemod');
const MakeMeme = require('./commands/makememe');

// Config
const config = require('./config.json');

const rest = new REST({ version: '9' }).setToken(config.access_token);
const api_commands = [];

api_commands.push(WatchThread.command(),
	UnWatchThread.command(),
	AddReactRole.command(),
	RemoveReactRole.command(),
	AddMod.command(),
	RemoveMod.command(),
	...MakeMeme.command());

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(config.client_id, config.guild_id),
			{ body: api_commands },
		);
	} catch (error) {
		console.error(error);
	}
})();

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('the game of life', { type: 'PLAYING' })
});

client.on('interactionCreate', (interaction) => {
	if (interaction.isCommand()) {
		AddMod.execute(interaction);
		RemoveMod.execute(interaction);
		WatchThread.execute(interaction);
		UnWatchThread.execute(interaction);
		AddReactRole.execute(interaction);
		RemoveReactRole.execute(interaction);
		MakeMeme.execute(interaction);
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	ReactRole.execute(reaction, user);
});
client.on('messageReactionRemove', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	ReactUnRole.execute(reaction, user);
});


client.on('threadUpdate', (event) => {
	PermaThreads.execute(event);
});


// Login to Discord with your client's token
client.login(config.access_token);
