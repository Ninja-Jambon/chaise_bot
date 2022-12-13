//Importing libs
const { Telegraf } = require('telegraf');
const fs = require('fs');

//Importing other files
const { getJoke } = require('./libs/dadJokes');
const { rtag, r34 } = require('./libs/rule34');
const { addToLogs, isTrue, image_search, getHelp } = require('./libs/botTools');
const { rockPaperScissorsAgainstBot } = require('./libs/games');
const { generateImage, answerQuestion } = require('./libs/openAi');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);

//bot commands
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

bot.command('anime', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'List of anime :\nKonosuba 1 : \nhttps://mega.nz/folder/M4gFRYbT#jiHwPRtkf7YyN6-MoguQcw\nKonosuba 2 :\nhttps://mega.nz/folder/JgZgiZbS#S0J1SoUd_TFKKun6SSJgmQ', {})
    console.log('--> sent anime list')
    addToLogs('--> sent anime list')
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
    generateImage(ctx.message.text.slice(+3), ctx, bot)
})

bot.command('q', ctx => {
    answerQuestion(ctx.message.text.slice(+3), ctx, bot)
})

bot.command('sb' , ctx => {
    bot.telegram.sendAudio(ctx.chat.id, "./src/audio/Spider-Bigard.mp3", {})
})

//bot launch
bot.launch();