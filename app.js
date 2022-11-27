const { Telegraf } = require('telegraf');
const fs = require('fs');
const https = require('https');
const { getJoke } = require('./dadJokes');
const r34 = require('./rule34');
const { addToLogs, isTrue, image_search } = require('./botTools');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);

//bot commands
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {})
    console.log("--> sent the start message to " + ctx.message.from.username);
    addToLogs("--> sent the start message to " + ctx.message.from.username);
})

bot.help(ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'This is the help message :\nHelp command : \n  -/help\nAnime command : \n  -/anime\nImage search command : \n  -`/s <query>`\nRule34 tag command :\n  -`/rtag <querry>`\nRule 34 image search :\n  -`/r34 <tag>`\nTruce command :\n  -/truce (reply to a message with that command to verify it)\nSuggest command :\n  -`/suggest <suggestion>` (allows you to add a suggestion to the chanel t.me/+SrzC81CGyusyODNk)\nGithub link command : \n  -/github', {parse_mode: "Markdown"})
    console.log('--> sent the help message')
    addToLogs('--> sent the help message')
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

bot.command('chatInfo', ctx => {
    console.log(ctx.chat.id)
})

bot.command('suggest', ctx => {
    bot.telegram.sendMessage('-1001782224138', 'New suggestion of ' + ctx.message.from.username + " : " + ctx.message.text.slice(+9), {})
    bot.telegram.sendMessage(ctx.chat.id, 'Your suggestion has been sent to the channel t.me/+SrzC81CGyusyODNk', {})
    console.log('--> sent suggestion message to the channel')
    addToLogs('--> sent suggestion message to the channel')
})

bot.command('rtag', ctx => {
    r34.rtag(ctx.message.text.slice(+6), ctx, bot)
})

bot.command('r34', ctx => {
    r34.r34(ctx.message.text.slice(+5), ctx, bot)
})

bot.command('dadjoke', ctx => {
    getJoke(ctx, bot)
    console.log('--> sent a dad joke')
})

//bot launch
bot.launch();