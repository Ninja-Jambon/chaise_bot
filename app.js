const { Telegraf } = require('telegraf');
const google = require('googlethis');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);

//functions
function image_search(query, ctx) {
    const images = google.image(query, { safe: false });
    images.then((results) => {
        var imgLink = results[Math.floor(Math.random() * results.length)].url
        bot.telegram.sendPhoto(ctx.chat.id, imgLink, {"caption": "This is a random image for the query : " + query});
        console.log("--> sent the image for the query: " + query);
    });
}

function isTrue(message, ctx) {
    var totalSum = 0

    for (var i = 0; i < message.length; i++) {
        totalSum += message.charCodeAt(i)
    }
    if (totalSum%2  == 0) {
        bot.telegram.sendMessage(ctx.chat.id, "This message is true", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
        console.log("--> sent true for the query: " + message);
    }
    else {
        bot.telegram.sendMessage(ctx.chat.id, "This message is false", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
        console.log("--> sent false for the query: " + message);
    }
}

//bot commands
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {})
    console.log("--> sent the start message to " + ctx.message.from.username);
})

bot.help(ctx => {
    ctx.reply('This is the help message :\nHelp command : \n  -/help\nAnime command : \n  -/anime\nImage search command : \n  -/search or /s\nTruce command :\n  -/truce (reply to a message with that command to verify it)\nGithub link command : \n  -/github')
    console.log('--> sent the help message')
})

bot.command('anime', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'List of anime :\nKonosuba 1 : \nhttps://mega.nz/folder/M4gFRYbT#jiHwPRtkf7YyN6-MoguQcw\nKonosuba 2 :\nhttps://mega.nz/folder/JgZgiZbS#S0J1SoUd_TFKKun6SSJgmQ', {})
    console.log('--> sent anime list')
})

bot.command('github', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot', {})
    console.log('--> sent github link')
})

bot.command('search', ctx => {
    image_search(ctx.message.text.slice(+8), ctx)
})

bot.command('s', ctx => {
    image_search(ctx.message.text.slice(+3), ctx)
})

bot.command('truce', ctx => {
    const message = ctx.update.message.reply_to_message.text
    isTrue(message, ctx)
})

//bot launch
bot.launch();