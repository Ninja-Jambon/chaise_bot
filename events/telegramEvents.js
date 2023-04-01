const fs = require('fs');

const { getJoke } = require('../libs/dadJokes');
const { rtag, r34 } = require('../libs/rule34');
const { addToLogs, isTrue, getHelp } = require('../libs/botTools');
const { generateImage, answerQuestion, sendConv, quickAnswer } = require('../libs/openAi');
const { addUserToDb, incrementQuota, usersInDb, getQuota, addConv, delConv, getConvs, addMessage, getMessages, isNewUser } = require('../libs/mysql');

module.exports = {
    start : (bot) => {
        bot.command('start', ctx => {
            bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {})
            console.log("[Telegram] sent the start message to " + ctx.message.from.username);
            addToLogs("[Telegram] sent the start message to " + ctx.message.from.username);
        })
    },

    help : (bot) => {
        bot.command('help', ctx => {
            if (ctx.message.text.slice(+6) != '') {
                getHelp(ctx.message.text.slice(+6), ctx, bot);
            } else {
                fs.readFile('./src/telegram_helps/default.txt', 'utf8', (err, data) => {
                    if (err) {
                        console.log(err);
                        addToLogs(err);
                        bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
                    } else {
                        bot.telegram.sendMessage(ctx.chat.id, data, {parse_mode: 'Markdown'});
                        console.log("[Telegram] sent the help message to " + ctx.message.from.username);
                        addToLogs("[Telegram] sent the help message to " + ctx.message.from.username);
                    }
                });
            }
        })
    },

    github : (bot) => {
        bot.command('github', ctx => {
            bot.telegram.sendMessage(ctx.chat.id, 'Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot', {})
            console.log('[Telegram] sent github link')
            addToLogs('[Telegram] sent github link')
        })
    },

    truce : (bot) => {
        bot.command('truce', ctx => {
            isTrue(ctx.update.message.reply_to_message.text, ctx, bot)
        })
    },

    chatinfo : (bot) => {
        bot.command('chatinfo', ctx => {
            console.log('[Telegram] sent chat info')
            addToLogs('[Telegram] sent chat info')
            bot.telegram.sendMessage(ctx.chat.id, 'Chat id : ' + ctx.chat.id, {})
        })
    },

    suggest : (bot) => {
        bot.command('suggest', ctx => {
            bot.telegram.sendMessage('-1001782224138', 'New suggestion of ' + ctx.message.from.username + " : " + ctx.message.text.slice(+9), {})
            bot.telegram.sendMessage(ctx.chat.id, 'Your suggestion has been sent to the channel t.me/+SrzC81CGyusyODNk', {})
            console.log('[Telegram] sent suggestion message to the channel')
            addToLogs('[Telegram] sent suggestion message to the channel')
        })
    },

    rtag : (bot) => {
        bot.command('rtag', ctx => {
            rtag(ctx.message.text.slice(+6), ctx, bot)
        })
    },

    r34 : (bot) => {
        bot.command('r34', ctx => {
            r34(ctx.message.text.slice(+5), ctx, bot)
        })
    },

    dadjoke : (bot) => {
        bot.command('dadjoke', ctx => {
            getJoke(ctx, bot)
            console.log('[Telegram] sent a dad joke')
        })
    },

    g : (bot) => {
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
    },

    q : (bot) => {
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
    },

    quota : (bot) => {
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
    },

    lc : (bot) => {
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
    },

    addconv : (bot) => {
        bot.command('addconv', async ctx => {
            convs = await getConvs();
        
            if (convs.includes(ctx.message.text.slice(+9) || ctx.message.text.slice(+9) == "" || ctx.message.text.contains(" "))) {
                bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation (it must not contain spaces and must be unique).", {});
            } else {
                await addConv(ctx.message.text.slice(+9));
                bot.telegram.sendMessage(ctx.chat.id, "Conversation added.", {});
            }
        })
    },

    delconv : (bot) => {
        bot.command('delconv', async ctx => {
            convs = await getConvs();
        
            if (!convs.includes(ctx.message.text.slice(+9))) {
                bot.telegram.sendMessage(ctx.chat.id, "Verify the name of the conversation.", {});
            } else {
                await delConv(ctx.message.text.slice(+9));
                bot.telegram.sendMessage(ctx.chat.id, "Conversation deleted.", {});
            }
        })
    },

    displayconv : (bot) => {
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
    },

    addmsg : (bot) => {
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
    },
}