const discord = require('discord.js');

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
const dalle = require('../functions/discord/dalle');
const addchannel = require('../functions/discord/addchannel');
const deletechannel = require('../functions/discord/deletechannel');

const { listchannels, incrementQuota } = require('../libs/mysql');
const { sendQuickConv } = require('../libs/openAi')

module.exports = {
    newMessage: (client) => {
        client.on('messageCreate', async msg => {
            const channels = await listchannels();
            channelId = msg.channel.id;

            if (!channels.includes(channelId) || msg.author.bot == true) {} 
            else {
                discordMessages = await msg.channel.messages.fetch({ limit: 15 })

                discordMessages.reverse();

                messages = [{"role": "system", "content": "You are a helpful assistant."}];

                discordMessages.forEach(async message => {
                    if (msg.author.id == '1059559067846189067') {
                        messages.push({"role" : "assistant", "content" : message.content});
                    } else {
                        messages.push({"role" : "user", "content" : message.content});
                    }
                });

                response = await sendQuickConv(messages);

                msg.reply(response.data.choices[0].message.content);
                
                incrementQuota(msg.author.id, response.data.usage.total_tokens);
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
                dalle(interaction, client);
            }

            else if (interaction.commandName === 'addchannel') {
                addchannel(interaction, client);
            }

            else if (interaction.commandName === 'deletechannel') {
                deletechannel(interaction, client);
            }
        });
    },

    ready: (client) => {
        client.on('ready', async () => {
            console.log(`[Discord] Logged in as ${client.user.tag} !`);
            client.user.setPresence({ activities: [{ name: 'la belle chaise', type: 3 }] });

            const rest = new discord.REST({ version: '10' }).setToken(process.env.DISCORD);

            await rest.put(
                discord.Routes.applicationCommands('1059559067846189067'),
                { body: commands },
            );

            console.log('[Discord] Successfully reloaded application (/) commands globally.');
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