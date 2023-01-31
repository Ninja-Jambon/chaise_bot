//Importing libs
const { Telegraf } = require('telegraf');
const fs = require('fs');
const discord = require('discord.js');

//Importing other files
const { getJoke } = require('./libs/dadJokes');
const { rtag, r34 } = require('./libs/rule34');
const { addToLogs, isTrue, image_search, getHelp } = require('./libs/botTools');
const { rockPaperScissorsAgainstBot } = require('./libs/games');
const { generateImage, answerQuestion } = require('./libs/openAi');

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
        fs.readFile('./src/helps/default.txt', 'utf8', (err, data) => {
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

bot.command('s', ctx => {
    image_search(ctx.message.text.slice(+3), ctx, bot)
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

bot.command('rps', ctx => {
    rockPaperScissorsAgainstBot(ctx.message.text.slice(+5), ctx, bot)
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
    answerQuestion(ctx.message.text.slice(+3)).then((res) => {
        console.log('[Telegram] Sent answer to : ' + ctx.message.text.slice(+3));
        addToLogs('[Telegram] Sent answer to : ' + ctx.message.text.slice(+3));
        bot.telegram.sendMessage(ctx.chat.id, res.data.choices[0].text.slice(+2), {});
    }).catch((err) => {
        console.log(err);
        addToLogs(err);
        bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
    })

    console.log('[Telegram] Generating answer to : ' + ctx.message.text.slice(+3));
    addToLogs('[Telegram] Generating answer to : ' + ctx.message.text.slice(+3));
    bot.telegram.sendMessage(ctx.chat.id, 'Generating the answer...', {});
})

bot.command('sb' , ctx => {
    bot.telegram.sendAudio(ctx.chat.id, "./src/audio/Spider-Bigard.mp3", {})
})

//Discord commands
client.on('ready', () => {
    console.log(`[Discord] Logged in as ${client.user.tag} !`);
});

client.on('messageCreate', async msg => {
    if (msg.content.startsWith('/github')) {
        console.log('[Discord] Sent github link')
        addToLogs('[Discord] Sent github link')
        msg.reply('Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot')
    }
    
    else if (msg.content.startsWith('/q')) {
        answerQuestion(msg.content.slice(+3)).then((res) => {
            console.log('[Discord] Sent answer to : ' + msg.content.slice(+3));
            addToLogs('[Discord] Sent answer to : ' + msg.content.slice(+3));
            msg.reply(res.data.choices[0].text.slice(+2));
        }).catch((err) => {
            console.log(err);
            addToLogs(err);
            msg.reply("Something went wrong");
        })

        console.log('[Discord] Generating answer to : ' + msg.content.slice(+3));
        addToLogs('[Discord] Generating answer to : ' + msg.content.slice(+3));
        msg.reply('Generating the answer...');
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

//bot launch
bot.launch()
client.login(process.env.DISCORD);