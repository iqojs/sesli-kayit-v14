const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest');
const config = require("./src/config.js");
const { readdirSync } = require("fs");


client.commands = new Collection()
const commands = [];

const rest = new REST({ version: '10' }).setToken(config.token);

readdirSync('./src/commands').forEach(async file => {
  const command = await require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})


client.on(Events.ClientReady, async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    console.log(`${client.user.username} Aktif Edildi!`);
})

readdirSync('./src/events').forEach(async file => {
	const event = await require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
})


process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })


client.login(config.token)
