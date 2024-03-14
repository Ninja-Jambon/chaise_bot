import * as fs from 'fs';
import * as path from 'path';
import "dotenv/config";
import { Client, Collection, REST, Routes, RESTPutAPIApplicationCommandsResult, GatewayIntentBits, Partials } from 'discord.js';

const client: Client = new Client({
	intents: [
	    GatewayIntentBits.Guilds,
	    GatewayIntentBits.GuildMessages,
	    GatewayIntentBits.MessageContent,
    	GatewayIntentBits.DirectMessages,
   	],
	partials: [
		Partials.Channel,
		Partials.Message,
	]
})

client.commands = new Collection();
const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  	const commandsPath = path.join(foldersPath, folder);
  	const commandFiles = fs
    	.readdirSync(commandsPath)
    	.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  	for (const file of commandFiles) {
    	const filePath = path.join(commandsPath, file);
    	const command = require(filePath);
    	if ("data" in command && "execute" in command) {
      		client.commands.set(command.data.name, command);
      		commands.push(command.data.toJSON());
    	} 
    	else {
      		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    	}
  	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : "");

(async () => {
  	try {
    	console.log(`Started refreshing ${commands.length} application (/) commands.`);

    	const data = await rest.put(
      		Routes.applicationCommands(process.env.BOT_ID ? process.env.BOT_ID : ""),
      		{ body: commands }
    	);

    	console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
  	} catch (error) {
    	console.error(error);
  	}
})();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  	.readdirSync(eventsPath)
  	.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of eventFiles) {
  	const filePath = path.join(eventsPath, file);
  	const event = require(filePath);

  	if (event.once) {
    	client.once(event.name, (...args) => event.execute(...args));
  	} 
  	else {
    	client.on(event.name, (...args) => event.execute(...args));
  	}
}

client.login(process.env.DISCORD_TOKEN);
