const discord = require('discord.js');

const { addToLogs } = require('../libs/botTools');
const { generateImage, } = require('../libs/openAi');

const { commands } = require('../commands/commands');

const gptrequest = require('../functions/discord/gptrequest');
const quickGptrequest = require('../functions/discord/quickGptrequest');
const addconv = require('../functions/discord/addconv');
const delconv = require('../functions/discord/delconv');
const listconvs = require('../functions/discord/listconvs');
const addmsg = require('../functions/discord/addmsg');
const displayconv = require('../functions/discord/displayconv');
const getmyguota = require('../functions/discord/getmyguota');
const github = require('../functions/discord/github');

module.exports = {
    newMessage: (client) => {
        client.on('messageCreate', async msg => {
            if (msg.content.startsWith('/g')) {
                generateImage(msg.content.slice(+3)).then((res) => {
                    console.log('[Discord] Sent image to : ' + msg.content.slice(+3));
                    addToLogs('[Discord] Sent image to : ' + msg.content.slice(+3));
                    msg.channel.send(res.data.data[0].url);
                }).catch((err) => {
                    console.log(err);
                    addToLogs(err);
                    msg.reply("Something went wrong");
                })

                console.log('[Discord] Generating image to : ' + msg.content.slice(+3));
                addToLogs('[Discord] Generating image to : ' + msg.content.slice(+3));
                msg.reply('Generating the image...');
            }
        });
    },


    newInteraction: (client) => {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'gptrequest') {
                gptrequest(interaction, client);
            }

            else if (interaction.commandName === 'quickgpt') {
                quickGptrequest(interaction, client);
            }

            else if (interaction.commandName === 'info') {
                console.log(interaction)
            }

            else if (interaction.commandName === 'addconv') {
                addconv(interaction, client);
            }

            else if (interaction.commandName === 'delconv') {
                delconv(interaction, client);
            }

            else if (interaction.commandName === 'listconvs') {
                listconvs(interaction, client);
            }

            else if (interaction.commandName === 'addmsg') {
                addmsg(interaction, client);
            }

            else if (interaction.commandName === 'displayconv') {
                displayconv(interaction, client);
            }

            else if (interaction.commandName === 'getmyguota') {
                getmyguota(interaction);
            }

            else if (interaction.commandName === 'github') {
                github(interaction, client);
            }

            else if (interaction.commandName === 'dalle') {
                github(interaction, client);
            }
        });
    },

    ready: (client) => {
        client.on('ready', () => {
            console.log(`[Discord] Logged in as ${client.user.tag} !`);
            client.user.setPresence({ activities: [{ name: 'la belle chaise', type: 3 }] });

            const rest = new discord.REST({ version: '10' }).setToken(process.env.DISCORD);

            client.guilds.cache.forEach(async (guild) => {
                try {
                    await rest.put(
                        discord.Routes.applicationGuildCommands('1059559067846189067', guild.id),
                        { body: commands },
                    );

                    console.log('[Discord] Successfully reloaded application (/) commands for ' + guild.name + '.');
                } catch (error) {
                    console.error(error);
                }
            })
        });
    },

    guildCreate: (client) => {
        client.on('guildCreate', async (guild) => {
            const rest = new discord.REST({ version: '10' }).setToken(process.env.DISCORD);

            try {
                await rest.put(
                    discord.Routes.applicationGuildCommands('1059559067846189067', guild.id),
                    { body: commands },
                );

                console.log('[Discord] Successfully reloaded application (/) commands for ' + guild.name + '.');
            } catch (error) {
                console.error(error);
            }
        });
    },
}