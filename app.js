//Importing libs
const { Telegraf } = require('telegraf');
const discord = require('discord.js');

//Importing events
const discordEvents = require('./events/discordEvents'); 
const telegramEvents = require('./events/telegramEvents');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);
const client = new discord.Client({intents: 3276799});

//Telegram events
telegramEvents.start(bot);
telegramEvents.help(bot);
telegramEvents.github(bot);
telegramEvents.truce(bot);
telegramEvents.chatinfo(bot);
telegramEvents.suggest(bot);
telegramEvents.rtag(bot);
telegramEvents.r34(bot);
telegramEvents.dadjoke(bot);
telegramEvents.g(bot);
telegramEvents.q(bot);
telegramEvents.quota(bot);
telegramEvents.lc(bot);
telegramEvents.addconv(bot);
telegramEvents.delconv(bot);
telegramEvents.displayconv(bot);
telegramEvents.addmsg(bot);

//Discord events
discordEvents.ready(client);
discordEvents.newMessage(client);
discordEvents.newInteraction(client);
discordEvents.guildCreate(client);

//bot launch
bot.launch()
client.login(process.env.DISCORD);