const { glob } = require("glob");
const { Client } = require("discord.js");
const { promisify } = require("util");

const globPromise = promisify(glob);

module.exports = async (client) => {
    // Slash Commands
    const arrayOfCommands = [];
    const commandHandlers = await globPromise(`${process.cwd()}/commands/*/*.js`);
    commandHandlers.map((commandHandler) => {
        const handler = require(commandHandler); // Get the Handler
        if (!handler.name) return; // Don't process the command handler its invalid
        client.commands.set(handler.name, handler);

        if (["MESSAGE", "USER"].includes(handler.type)) delete handler.description;
        if (handler.userPermissions) handler.defaultPermissions = false;
        arrayOfCommands.push(handler);
        console.log(`[BullyBot] Added Command: ${handler.name}`);
    });

    client.on("ready", async () => {
        await client.application.commands.set(arrayOfCommands);
        console.log("[BullyBot] Ready!");
    })

    // Events
    const eventHandlers = await globPromise(`${process.cwd()}/events/*.js`);
    eventHandlers.map((eventHandler) => {
        require(eventHandler);
        const path = eventHandler.split("/");
        console.log(`[BullyBot] Added Event: ${path[path.length-1].replace('.js', '')}`);
    });
}