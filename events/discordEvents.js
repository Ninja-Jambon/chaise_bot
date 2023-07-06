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
const help = require('../functions/discord/help');

const { listchannels, incrementQuota, isNewUser } = require('../libs/mysql');
const { sendQuickConv } = require('../libs/openAi')

module.exports = {
    newMessage: (client) => {
        client.on('messageCreate', async msg => {
            const channels = await listchannels();
            channelId = msg.channel.id;

            quota = await isNewUser(msg.author.id, msg.author.username).catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            if (!channels.includes(channelId) || msg.author.bot == true) {} 
        
            else if (quota.quota >= 200000) {
                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
                    .setDescription("Quota exceeded, please wait untill reset (every month)")
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });
        
                msg.reply({ embeds: [embed] });
            } else {
                discordMessages = await msg.channel.messages.fetch({ limit: 8 })

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

            else if (interaction.commandName === 'help') {
                help(interaction, client);
            }
        });
    },

    ready: (client) => {
        client.on('ready', async () => {
            console.log(`[Discord] Logged in as ${client.user.tag} !`);

            const rest = new discord.REST({ version: '10' }).setToken(process.env.DISCORD);

            await rest.put(
                discord.Routes.applicationCommands('1059559067846189067'),
                { body: commands },
            );

            console.log('[Discord] Successfully reloaded application (/) commands globally.');

            client.user.setPresence({ activities: [{ name: client.guilds.cache.size + ' servers !', type: 3 }] });

            n = 1;

            act = [
                [{ name: client.guilds.cache.size + ' servers !', type: 3 }],
                [{ name: '/help command', type: 3 }],
            ];

            setInterval(() => {
                client.user.setPresence({ activities: act[n] });
                if (n == 1) { n = 0; } 
                else { n = 1; }
            }, 10000);
        });
    },
}