// Push Commands
require('./deploy_commands.js');
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { access_token } = require('./config.json');
const RuleEnforcement_Plugin = require('./commands/forcerules.js');
const VotePolling_Plugin = require('./commands/votepolling');

// Create a new client instance
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'REACTION'],
});

let rfPlugin = new RuleEnforcement_Plugin();
let vpPlugin = new VotePolling_Plugin(client);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

    if (commandName == "bbtoggleforcerules") {
        result = rfPlugin.rfToggle() ? "enabled" : "disabled";
        interaction.reply("Rule Enforcement is now " + result + "!");
    }
});

// Login to Discord with your client's token
client.login(access_token);