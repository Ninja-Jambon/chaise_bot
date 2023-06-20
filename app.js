//Importing libs
const discord = require('discord.js');

//Importing events
const discordEvents = require('./events/discordEvents'); 

//bot initialization
const client = new discord.Client({intents: 33297});

//events
discordEvents.ready(client);
discordEvents.newMessage(client);
discordEvents.newInteraction(client);
discordEvents.guildCreate(client);

//bot launch
client.login(process.env.DISCORD);