const discord = require('discord.js');

const { addToLogs } = require('../libs/botTools');
const { generateImage, answerQuestion, sendConv } = require('../libs/openAi');
const { incrementQuota, addConv, delConv, getConvs, addMessage, getMessages, isNewUser } = require('../libs/mysql');

const { commands } = require('../commands/commands');

async function gptrequest(interaction, client) {
    await interaction.deferReply();

    quota = isNewUser(interaction.member.user.id, interaction.member.user.username).catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (quota >= 200000) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
            .setDescription("You have a quota of " + quota + " tokens, please wait until reset (every months)")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
    }
    else {
        answerQuestion(interaction.options.get('question').value).then((res) => {
            incrementQuota(interaction.member.user.id, res.data.usage.total_tokens).catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            if (res.data.choices[0].message.content.length > 4096) {
                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Reply to : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                    .setTitle("Question : " + interaction.options.get('question').value)
                    .setDescription("The answer is too long to be displayed, please try again with a shorter question.")
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                addToLogs('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                interaction.editReply({ embeds: [embed] });
            }
            else {
                title = "Question : " + interaction.options.get('question').value;

                if (title.length > 256) {
                    title = title.slice(0, 253) + "...";
                }

                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Reply to : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                    .setTitle(title)
                    .setDescription(res.data.choices[0].message.content)
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                addToLogs('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                interaction.editReply({ embeds: [embed] });
            }
        }).catch((err) => {
            console.log(err);
            addToLogs(err);
            interaction.editReply("Something went wrong");
        })

        console.log('[Discord] Generating answer to : ' + interaction.options.get('question').value);
        addToLogs('[Discord] Generating answer to : ' + interaction.options.get('question').value);
    }
}


async function addconv(interaction, client) {
    await interaction.deferReply();
    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });
    if (!interaction.options.get('name').value.includes(" ") && !convs.includes(interaction.options.get('name').value)) {
        await addConv(interaction.options.get('name').value);
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation added", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation " + interaction.options.get('name').value + " added to db")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Added conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Added conversation : ' + interaction.options.get('name').value);
    } else {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Verify the name of the conversation (it must not contain spaces and must be unique).")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
    }
}


async function delconv(interaction, client) {
    await interaction.deferReply();

    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });
    if (!convs.includes(interaction.options.get('name').value)) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation not found in the database")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
        console.log('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
    } else {
        await delConv(interaction.options.get('name').value);
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation deleted", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation " + interaction.options.get('name').value + " deleted from the database")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
        console.log('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
    }
}


async function listconvs(interaction, client) {
    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });
    message = "";
    if (convs.length == 0) {
        message = "No conversations in the database";
    } else {
        convs.forEach(element => {
            message += "- **" + element + "**\n\n";
        });
    }

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Conversations list", iconURL: client.user.displayAvatarURL() })
        .setDescription(message)
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.reply({ embeds: [embed] });

    addToLogs('[Discord] Sent conversations list');
    console.log('[Discord] Sent conversations list');
}


async function addmsg(interaction, client) {
    await interaction.deferReply();

    quota = isNewUser(interaction.member.user.id, interaction.member.user.username).catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (quota >= 200000) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
            .setDescription("Quota exceeded, please wait untill reset (every month)")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
        console.log('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
    } else {
        await addMessage(interaction.options.get('name').value, "user", interaction.options.get('message').value.replace(/"/g, "\'").replace("\""), interaction.member.user.username).catch((err) => {
            console.log(err);
            addToLogs(err);
        });

        messages = await getMessages(interaction.options.get('name').value, "role").catch((err) => {
            console.log(err);
            addToLogs(err);
        });

        sendConv(messages).then((res) => {
            addMessage(interaction.options.get('name').value, "assistant", res.data.choices[0].message.content, "Chaise bot").catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            const embed_user = new discord.EmbedBuilder()
                .setColor(0xBBFAF4)
                .setAuthor({ name: interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                .setDescription(interaction.options.get('message').value);

            const embed_bot = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name: "Chaise bot", iconURL: client.user.displayAvatarURL() })
                .setDescription(res.data.choices[0].message.content)
                .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds: [embed_user, embed_bot] });

            addToLogs('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
            console.log('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
        }).catch((err) => {
            console.log(err);
        });
    }
}


async function displayconv(interaction, client) {
    await interaction.deferReply();

    if (interaction.options.get('name').value.includes(" ")) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation name can't contain spaces")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation name can\'t contain spaces');
        console.log('[Discord] Conversation name can\'t contain spaces');
    } else {
        convs = await getConvs().catch((err) => {
            console.log(err);
            addToLogs(err);
        });

        if (!convs.includes(interaction.options.get('name').value)) {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
                .setDescription("Conversation not found in the database")
                .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds: [embed] });

            addToLogs('[Discord] Conversation not found in the database');
            console.log('[Discord] Conversation not found in the database');
        }

        messages = await getMessages(interaction.options.get('name').value, "user").catch((err) => {
            console.log(err);
            addToLogs(err);
        });

        embed_text = "";

        messages.forEach(element => {
            if (element.user == "System") { }
            else {
                embed_text += "**" + element.user + "** : " + element.content + "\n\n";
            }
        });

        if (embed_text.length > 4096) {
            embed_text = "Conversation too long to display";
        }

        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation : " + interaction.options.get('name').value, iconURL: client.user.displayAvatarURL() })
            .setDescription(embed_text)
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
    }
}


async function getmyguota(interaction) {
    await interaction.deferReply();

    quota = (await isNewUser(interaction.member.user.id, interaction.member.user.username).catch((error) => {
        console.log(error);
        addToLogs(error);
    })).quota;

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Quota : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
        .setDescription("You have " + (200000 - quota) + " tokens left this month")
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.editReply({ embeds: [embed] });

    addToLogs('[Discord] Quota requested by ' + interaction.member.user.username);
    console.log('[Discord] Quota requested by ' + interaction.member.user.username);
}


async function github(interaction, client) {
    await interaction.deferReply();

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Github", iconURL: client.user.displayAvatarURL() })
        .setDescription('Link of the Gihhub repository :\n  https://github.com/Ninja-Jambon/chaise_bot')
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.editReply({ embeds: [embed] });

    addToLogs('[Discord] Github requested by ' + interaction.member.user.username);
    console.log('[Discord] Github requested by ' + interaction.member.user.username);
}

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