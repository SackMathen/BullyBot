const { Client, Collection, Intents } = require("discord.js");
const Keyv = require ('keyv');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})
module.exports = client;

client.commands = new Collection();
client.db = new Keyv('sqlite://db.sqlite');
client.config = require("./config.json");


// Initialize Handlers
require("./handlers")(client);

client.login(client.config.access_token);