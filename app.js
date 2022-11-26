const { Telegraf } = require('telegraf');
const google = require('googlethis');
const fs = require('fs');
const https = require('https');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);

//functions
function image_search(query, ctx) {
    const images = google.image(query, { safe: false }).catch(err => {
        console.log(err);
        addToLogs("--> error : " + err);
        bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {"reply_to_message_id": ctx.update.message.message_id});
    });
    images.then((results) => {
        var imgLink = results[Math.floor(Math.random() * results.length)].url
        bot.telegram.sendPhoto(ctx.chat.id, imgLink, {"caption": "This is a random image for the query : " + query}).catch(err => {
            console.log(err);
            addToLogs("--> error : " + err);
            bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {"reply_to_message_id": ctx.update.message.message_id});
        });
        console.log("--> sent the image for the query: " + query);
        addToLogs("--> sent the image for the query: " + query);
    })
}

function isTrue(message, ctx) {
    if (message != undefined) {
        console.log("--> message received: " + message);
        addToLogs("--> message received: " + message);
        var totalSum = 0

        for (var i = 0; i < message.length; i++) {
            totalSum += message.charCodeAt(i)
        }
        if (totalSum%2  == 0) {
            bot.telegram.sendMessage(ctx.chat.id, "This message is true", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
            console.log("--> sent true for the query: " + message);
            addToLogs("--> sent true for the query: " + message);
        }
        else {
            bot.telegram.sendMessage(ctx.chat.id, "This message is false", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
            console.log("--> sent false for the query: " + message);
            addToLogs("--> sent false for the query: " + message);
        }
    } else {
        bot.telegram.sendMessage(ctx.chat.id, "Please reply to a text message", {'reply_to_message_id': ctx.update.message.message_id});
    }
}

function r34sTag(query, ctx) {
    console.log("--> r34sTag query: " + query);
    addToLogs("--> r34sTag query: " + query);
    https.get("https://rule34.xxx/public/autocomplete.php?q=" + query, (resp) => {
        let data = '';
            
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res = JSON.parse(data);
            message = "Tags for the query: " + query + "\n\n" ;

            if (res.length == 0) {
                console.log("--> no tags found for the query: " + query);
                addToLogs("--> no tags found for the query: " + query);
                bot.telegram.sendMessage(ctx.chat.id, "No tags found for the query: " + query, {});
            } else if (res.length > 10) {
                for (var i = 0; i < 10; i++) {
                    message += "  - " + res[i].value + "\n";
                }
                message += "\nUse /r34 <tag> to get a random image for the tag";
                bot.telegram.sendMessage(ctx.chat.id, message, {});
                console.log("--> sent the tags for the query: " + query);
                addToLogs("--> sent the tags for the query: " + query);
            } else {
                for (var i = 0; i < res.length; i++) {
                    message += "  - " + res[i].value + "\n";
                }
                message += "\nUse /r34 <tag> to get a random image for the tag";
                bot.telegram.sendMessage(ctx.chat.id, message, {});
                console.log("--> sent the tags for the query: " + query);
                addToLogs("--> sent the tags for the query: " + query);
            }
        });

    }).on("error", (err) => {
        console.log(err);
        addToLogs("--> error : " + err);
    })
}

function r34(tag, ctx) {
    console.log("--> r34 query: " + tag);
    addToLogs("--> r34 query: " + tag);
    https.get('https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=' + tag, (resp) => {
        let data = '';
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res = JSON.parse(data);

            bot.telegram.sendPhoto(ctx.chat.id, res[Math.floor(Math.random() * res.length)].file_url, {"caption": "This is a random image for the tag : " + tag}).catch(err => {
                console.log(err);
                addToLogs("--> error : " + err);
                bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
            });
        });
        
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

function addToLogs(message) {
    fs.appendFile('./logs/logs.txt', message + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
}

//bot commands
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.\nType /help for help.', {})
    console.log("--> sent the start message to " + ctx.message.from.username);
    addToLogs("--> sent the start message to " + ctx.message.from.username);
})

bot.help(ctx => {
    ctx.reply('This is the help message :\nHelp command : \n  -/help\nAnime command : \n  -/anime\nImage search command : \n  -/search or /s <query>\nTruce command :\n  -/truce (reply to a message with that command to verify it)\nSuggest command :\n  -/suggest <suggestion> (allows you to add a suggestion to the chanel t.me/+SrzC81CGyusyODNk)\nGithub link command : \n  -/github')
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

bot.command('search', ctx => {
    image_search(ctx.message.text.slice(+8), ctx)
})

bot.command('s', ctx => {
    image_search(ctx.message.text.slice(+3), ctx)
})

bot.command('truce', ctx => {
    isTrue(ctx.update.message.reply_to_message.text, ctx)
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

bot.command('r34sTag', ctx => {
    r34sTag(ctx.message.text.slice(+9), ctx)
})

bot.command('r34', ctx => {
    r34(ctx.message.text.slice(+5), ctx)
})

//bot launch
bot.launch();