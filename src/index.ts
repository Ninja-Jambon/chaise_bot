import * as fs from 'fs';
import * as path from 'path';
import "dotenv/config";
import { Client, Collection, REST, Routes, RESTPutAPIApplicationCommandsResult } from 'discord.js';

const client: Client = new Client({
	intents: [],
	partials: []
})

client.commands = new Collection();
const commands: any[] = [];

async function loadCommands() {
	const foldersPath = './src/commands';
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
	  	const commandsPath = `./src/commands/${folder}`;
	  	const commandFiles = fs
	    	.readdirSync(commandsPath)
	    	.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	  	for (const file of commandFiles) {
	    	const filePath = `./commands/${folder}/${file}`;
	    	const command = await import(filePath.replace(".ts", ".js"));
	    	if ("data" in command.default && "execute" in command.default) {
	      		client.commands.set(command.default.data.name, command.default);
	      		commands.push(command.default.data.toJSON());
	    	} 
	    	else {
	      		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	    	}
	  	}
	}
}

async function loadEvents() {
	const eventsPath = "./src/events";
	const eventFiles = fs
	  	.readdirSync(eventsPath)
	  	.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of eventFiles) {
	  	const filePath = `./events/${file}`;
	  	const event = await import(filePath.replace(".ts", ".js"));

	  	if (event.default.once) {
	    	client.once(event.default.name, (...args) => event.default.execute(...args));
	  	} 
	  	else {
	    	client.on(event.default.name, (...args) => event.default.execute(...args));
	  	}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : "");

(async () => {
	await loadCommands();
	await loadEvents();
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

client.login(process.env.DISCORD_TOKEN);
