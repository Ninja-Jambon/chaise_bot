const fs = require('fs');
const google = require('googlethis');

function image_search(query, ctx, bot) {
    //
    //Search for an image on google and send it to the user
    //
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

function isTrue(message, ctx, bot) {
    //
    //Check if the message is a command
    //
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

function addToLogs(message) {
    //
    //Add a message to the logs
    //
    fs.appendFile('./logs/logs.txt', message + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
}

function getHelp(commandName, ctx, bot) {
    const commands = [ 'images', 'games', 'r34', 'openai', 'tools' ];
    const commandsPaths = { 'images': './src/helps/images.txt', 'games': './src/helps/games.txt', 'r34': './src/helps/r34.txt', 'openai': './src/helps/openAI.txt', 'tools': './src/helps/tools.txt' };

    if (commands.includes(commandName)) {
        fs.readFile(commandsPaths[commandName], 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
            } else {
                bot.telegram.sendMessage(ctx.chat.id, data, {parse_mode: 'Markdown'});
            }
        });
    } else {
        bot.telegram.sendMessage(ctx.chat.id, "This command doesn't exist", {});
    }
}

module.exports = { addToLogs, isTrue, image_search, getHelp };