//Importing libs
const { Telegraf } = require('telegraf');
const discord = require('discord.js');
const fs = require('fs');

//Importing other files
const { getJoke } = require('./libs/dadJokes');
const { rtag, r34 } = require('./libs/rule34');
const { addToLogs, isTrue, getHelp } = require('./libs/botTools');
const { generateImage, answerQuestion, sendConv } = require('./libs/openAi');
const { addUserToDb, incrementQuota, usersInDb, getQuota, addConv, delConv, getConvs, addMessage, getMessages } = require('./libs/mysql');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);
const client = new discord.Client({intents: 3276799});

//Telegram commands
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {})
    console.log("--> sent the start message to " + ctx.message.from.username);
    addToLogs("--> sent the start message to " + ctx.message.from.username);
})

bot.command('help', ctx => {
    if (ctx.message.text.slice(+6) != '') {
        getHelp(ctx.message.text.slice(+6), ctx, bot);
    } else {
        fs.readFile('./src/telegram_helps/default.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
            } else {
                bot.telegram.sendMessage(ctx.chat.id, data, {parse_mode: 'Markdown'});
            }
        });
    }
})

bot.command('github', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot', {})
    console.log('--> sent github link')
    addToLogs('--> sent github link')
})

bot.command('truce', ctx => {
    isTrue(ctx.update.message.reply_to_message.text, ctx, bot)
})

bot.command('chatinfo', ctx => {
    console.log('--> sent chat info')
    addToLogs('--> sent chat info')
    bot.telegram.sendMessage(ctx.chat.id, 'Chat id : ' + ctx.chat.id, {})
})

bot.command('suggest', ctx => {
    bot.telegram.sendMessage('-1001782224138', 'New suggestion of ' + ctx.message.from.username + " : " + ctx.message.text.slice(+9), {})
    bot.telegram.sendMessage(ctx.chat.id, 'Your suggestion has been sent to the channel t.me/+SrzC81CGyusyODNk', {})
    console.log('--> sent suggestion message to the channel')
    addToLogs('--> sent suggestion message to the channel')
})

bot.command('rtag', ctx => {
    rtag(ctx.message.text.slice(+6), ctx, bot)
})

bot.command('r34', ctx => {
    r34(ctx.message.text.slice(+5), ctx, bot)
})

bot.command('dadjoke', ctx => {
    getJoke(ctx, bot)
    console.log('--> sent a dad joke')
})

bot.command('g', ctx => {
    generateImage(ctx.message.text.slice(+3)).then((res) => {
        console.log('[Telegram] Sent image to : ' + ctx.message.text.slice(+3));
        addToLogs('[Telegram] Sent image to : ' + ctx.message.text.slice(+3));
        bot.telegram.sendPhoto(ctx.chat.id, res.data.data[0].url, {});
    }).catch((err) => {
        console.log(err);
        addToLogs(err);
        bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
    })

    console.log('[Telegram] Generating image to : ' + ctx.message.text.slice(+3));
    addToLogs('[Telegram] Generating image to : ' + ctx.message.text.slice(+3));
    bot.telegram.sendMessage(ctx.chat.id, "Generating image...", {});
})

bot.command('q', async ctx => {
    users = await usersInDb();

    if (!users.includes(ctx.message.from.id.toString())) {
        await addUserToDb(ctx.message.from.id, ctx.message.from.username);
        addToLogs('[Telegram] Added user ' + ctx.message.from.username + ' to the database');
        console.log('[Telegram] Added user ' + ctx.message.from.username + ' to the database');
    }

    quota = await getQuota(ctx.message.from.id);

    if (quota >= 200000) {
        bot.telegram.sendMessage(ctx.chat.id, "You have reached your quota, please wait untill it reset (every months).", {});
    } else {
        answerQuestion(ctx.message.text.slice(+3)).then((res) => {
            incrementQuota(ctx.message.from.id, res.data.usage.total_tokens);
            console.log('[Telegram] Sent answer to : ' + ctx.message.text.slice(+3));
            addToLogs('[Telegram] Sent answer to : ' + ctx.message.text.slice(+3));
            bot.telegram.sendMessage(ctx.chat.id, res.data.choices[0].message.content, {});
        }).catch((err) => {
            console.log(err);
            addToLogs(err);
            bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
        })

        console.log('[Telegram] Generating answer to : ' + ctx.message.text.slice(+3));
        addToLogs('[Telegram] Generating answer to : ' + ctx.message.text.slice(+3));
        bot.telegram.sendMessage(ctx.chat.id, 'Generating the answer...', {});
    }
})

bot.command('quota', async ctx => {
    users = await usersInDb();
    
    if (!users.includes(ctx.message.from.id.toString())) {
        await addUserToDb(ctx.message.from.id, ctx.message.from.username);
        addToLogs('[Telegram] Added user ' + ctx.message.from.username + ' to the database');
        console.log('[Telegram] Added user ' + ctx.message.from.username + ' to the database');
    }

    quota = await getQuota(ctx.message.from.id);

    bot.telegram.sendMessage(ctx.chat.id, "You have " + (200000 - quota) + " tokens left.", {});
})

bot.command('lc', async ctx => {
    convs = await getConvs();

    if (convs.length == 0) {
        bot.telegram.sendMessage(ctx.chat.id, "No conversation found.", {});
    } else {
        message = "Conversations : \n\n"

        convs.forEach(element => {
            message += "- " + element + "\n\n"
        });

        bot.telegram.sendMessage(ctx.chat.id, message, {});
    }
})

bot.command('addconv', async ctx => {
    convs = await getConvs();

    if (convs.includes(ctx.message.text.slice(+9) || ctx.message.text.slice(+9) == "" || ctx.message.text.contains(" "))) {
        bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation (it must not contain spaces and must be unique).", {});
    } else {
        await addConv(ctx.message.text.slice(+9));
        bot.telegram.sendMessage(ctx.chat.id, "Conversation added.", {});
    }
})

bot.command('delconv', async ctx => {
    convs = await getConvs();

    if (!convs.includes(ctx.message.text.slice(+9))) {
        bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation.", {});
    } else {
        await delConv(ctx.message.text.slice(+9));
        bot.telegram.sendMessage(ctx.chat.id, "Conversation deleted.", {});
    }
})

bot.command('displayconv', async ctx => {
    convs = await getConvs();

    if (!convs.includes(ctx.message.text.slice(+13))) {
        bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation.", {});
    } else {
        messages = await getMessages(ctx.message.text.slice(+13), "user");
        
        message = "Conversation " + ctx.message.text.slice(+13) + " :\n\n";

        messages.forEach(element => {
            if (element.user == "System") {}
            else {
                message += element.user + " : " + element.content + "\n\n";
            }
        });

        if (message == "") {
            bot.telegram.sendMessage(ctx.chat.id, "No message found.", {});
        } else {
            bot.telegram.sendMessage(ctx.chat.id, message, {});
        }
    }
})

bot.command('addmsg', async ctx => {
    convs = await getConvs();

    if (!convs.includes(ctx.message.text.slice(8, ctx.message.text.indexOf(" - ")))) {
        bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation.", {});
    } else {
        await addMessage(ctx.message.text.slice(+8, ctx.message.text.indexOf(" - ")),"user" , ctx.message.text.slice(ctx.message.text.indexOf(" - ")+3), ctx.message.from.username);
        
        console.log(ctx.message.text.slice(8, ctx.message.text.indexOf(" - ")));

        messages = await getMessages(ctx.message.text.slice(8, ctx.message.text.indexOf(" - ")), 'role');

        sendConv(messages).then((res) => {
            bot.telegram.sendMessage(ctx.chat.id, res.data.choices[0].message.content, {});
        }).catch((err) => {
            console.log(err);
            addToLogs(err);
        })
    }
})

//Discord commands
client.on('ready', () => {
    console.log(`[Discord] Logged in as ${client.user.tag} !`);
    client.user.setPresence({ activities: [{ name: 'la belle chaise', type : 3}] });
});

client.on('messageCreate', async msg => {
    if (msg.content.startsWith('/github')) {
        console.log('[Discord] Sent github link')
        addToLogs('[Discord] Sent github link')
        msg.reply('Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot')
    }

    else if (msg.content.startsWith('/g')) {
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


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'gptrequest') {
        await interaction.deferReply();

        users = await usersInDb();

        if (!(users.includes(interaction.member.user.id))) {
            await addUserToDb(interaction.member.user.id, interaction.member.user.username);
            addToLogs('[Discord] Added user to the database : ' + interaction.member.user.username);
            console.log('[Discord] Added user to the database : ' + interaction.member.user.username);
        }

        quota = await getQuota(interaction.member.user.id);
                
        if (quota >= 200000) {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Quota exceeded", iconURL : client.user.displayAvatarURL()})
                .setDescription("You have a quota of " + quota + " tokens, please wait until reset (every months)")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });
        }
        else {
            answerQuestion(interaction.options.get('question').value).then((res) => {
                incrementQuota(interaction.member.user.id, res.data.usage.total_tokens);
                if (res.data.choices[0].message.content.length > 4096) {
                    interaction.editReply(res.data.choices[0].message.content);
                    addToLogs('[Discord] Sent answer to : ' +interaction.options.get('question').value);
                    console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                }
                else{
                    const embed = new discord.EmbedBuilder()
                        .setColor(0xFABBDE)
                        .setAuthor({ name : "Reply to : " + interaction.member.user.username, iconURL : "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".jpeg"})
                        .setTitle("Question : " + interaction.options.get('question').value)
                        .setDescription(res.data.choices[0].message.content)
                        .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });
                    
                    console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                    addToLogs('[Discord] Sent answer to : ' +interaction.options.get('question').value);
                    interaction.editReply({ embeds : [embed] });
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

    else if (interaction.commandName === 'info') {
        console.log(interaction)
    }

    else if (interaction.commandName === 'addconv') {
        await interaction.deferReply();
        convs = await getConvs();
        if (!interaction.options.get('name').value.includes(" ") && !convs.includes(interaction.options.get('name').value)) {
            await addConv(interaction.options.get('name').value);
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Conversation added", iconURL : client.user.displayAvatarURL()})
                .setDescription("Conversation " + interaction.options.get('name').value + " added to db")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Added conversation : ' + interaction.options.get('name').value);
            console.log('[Discord] Added conversation : ' + interaction.options.get('name').value);
        } else {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Error", iconURL : client.user.displayAvatarURL()})
                .setDescription("Verify the name of the conversation (it must not contain spaces and must be unique).")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });
            
            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
            console.log('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
        }
    }

    else if (interaction.commandName === 'delconv') {
        await interaction.deferReply();

        convs = await getConvs();
        if (!convs.includes(interaction.options.get('name').value)) {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Error", iconURL : client.user.displayAvatarURL()})
                .setDescription("Conversation not found in the database")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
            console.log('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
        } else {
            await delConv(interaction.options.get('name').value);
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Conversation deleted", iconURL : client.user.displayAvatarURL()})
                .setDescription("Conversation " + interaction.options.get('name').value + " deleted from the database")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
            console.log('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
        }
    }

    else if (interaction.commandName === 'listconvs') {
        convs = await getConvs();
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
            .setAuthor({ name : "Conversations list", iconURL : client.user.displayAvatarURL()})
            .setDescription(message)
            .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });
        
        interaction.reply({ embeds : [embed] });

        addToLogs('[Discord] Sent conversations list');
        console.log('[Discord] Sent conversations list');
    }

    else if (interaction.commandName === 'addmsg') {
        await interaction.deferReply();

        users = await usersInDb();

        if (!(users.includes(interaction.member.user.id))) {
            await addUserToDb(interaction.member.user.id, interaction.member.user.username);
            addToLogs('[Discord] Added user to the database : ' + interaction.member.user.username);
            console.log('[Discord] Added user to the database : ' + interaction.member.user.username);
        }

        quota = await getQuota(interaction.member.user.id);
                
        if (quota >= 200000) {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Quota exceeded", iconURL : client.user.displayAvatarURL()})
                .setDescription("Quota exceeded, please wait untill reset (every month)")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
            console.log('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
        } else {
            await addMessage(interaction.options.get('name').value,"user" ,interaction.options.get('message').value, interaction.member.user.username);

            messages = await getMessages(interaction.options.get('name').value, "role");

            sendConv(messages).then((res) => {
                addMessage(interaction.options.get('name').value,"assistant",res.data.choices[0].message.content , "Chaise bot");

                const embed_user = new discord.EmbedBuilder()
                    .setColor(0xBBFAF4)
                    .setAuthor({ name : interaction.member.user.username, iconURL : "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".jpeg"})
                    .setDescription(interaction.options.get('message').value);

                const embed_bot = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name : "Chaise bot", iconURL : client.user.displayAvatarURL()})
                    .setDescription(res.data.choices[0].message.content)
                    .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                interaction.editReply({ embeds : [embed_user, embed_bot] });

                addToLogs('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
                console.log('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    else if (interaction.commandName === 'displayconv') {
        await interaction.deferReply();

        if (interaction.options.get('name').includes(" ")) {
            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Error", iconURL : client.user.displayAvatarURL()})
                .setDescription("Conversation name can't contain spaces")
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Conversation name can\'t contain spaces');
            console.log('[Discord] Conversation name can\'t contain spaces');
        }else {
            convs = await getConvs();

            if (!convs.includes(interaction.options.get('name').value)) {
                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name : "Error", iconURL : client.user.displayAvatarURL()})
                    .setDescription("Conversation not found in the database")
                    .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                interaction.editReply({ embeds : [embed] });

                addToLogs('[Discord] Conversation not found in the database');
                console.log('[Discord] Conversation not found in the database');
            }

            messages = await getMessages(interaction.options.get('name').value, "user");

            embed_text = "";

            messages.forEach(element => {
                if (element.user == "System") {}
                else {
                    embed_text += "**" + element.user + "** : " + element.content + "\n\n";
                }
            });

            const embed = new discord.EmbedBuilder()
                .setColor(0xFABBDE)
                .setAuthor({ name : "Conversation : " + interaction.options.get('name').value, iconURL : client.user.displayAvatarURL()})
                .setDescription(embed_text)
                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

            interaction.editReply({ embeds : [embed] });

            addToLogs('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
            console.log('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
        }
    }

    else if (interaction.commandName === 'getmyguota') {
        await interaction.deferReply();

        users = await usersInDb();

        if (!(users.includes(interaction.member.user.id))) {
            await addUserToDb(interaction.member.user.id, interaction.member.user.username);
            addToLogs('[Discord] Added user to the database : ' + interaction.member.user.username);
            console.log('[Discord] Added user to the database : ' + interaction.member.user.username);
        }

        quota = await getQuota(interaction.member.user.id);

        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name : "Quota : " + interaction.member.user.username, iconURL : "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".jpeg"})
            .setDescription("You have " + (200000 - quota) + " tokens left this month")
            .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds : [embed] });

        addToLogs('[Discord] Quota requested by ' + interaction.member.user.username);
        console.log('[Discord] Quota requested by ' + interaction.member.user.username);
    }
});

//bot launch
bot.launch()
client.login(process.env.DISCORD);