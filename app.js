const { Telegraf } = require('telegraf');
const google = require('googlethis');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);

//function to search google
function image_search(query, ctx) {
    const images = google.image(query, { safe: false });
    images.then((results) => {
        var imgLink = results[Math.floor(Math.random() * results.length)].url
        console.log("--> sent the image for the query: " + query);
        bot.telegram.sendPhoto(ctx.chat.id, imgLink, {"caption": "This is a random image for the query : " + query});
    });
}

//bot commands
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {
    })
})

bot.help(ctx => {
    console.log(ctx.from)
    ctx.reply('This is the help message :\nHelp command : \n  -/help\nAnime command : \n  -/anime\nImage search command : \n  -/search or /s\nGithub link command : \n  -/github')
})

bot.command('anime', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'List of anime :\nKonosuba 1 : \nhttps://mega.nz/folder/M4gFRYbT#jiHwPRtkf7YyN6-MoguQcw\nKonosuba 2 :\nhttps://mega.nz/folder/JgZgiZbS#S0J1SoUd_TFKKun6SSJgmQ', {})
})

bot.command('search', ctx => {
    console.log(ctx.from)
    image_search(ctx.message.text.slice(+8), ctx)
})

bot.command('s', ctx => {
    console.log(ctx.from)
    image_search(ctx.message.text.slice(+3), ctx)
})

bot.command('github', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Link of the Gihhub repository :\n  -https://github.com/Ninja-Jambon/chaise_bot', {})
})

//bot launch
bot.launch();