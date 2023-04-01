const fs = require('fs');

function isTrue(message, ctx, bot) {
    if (message != undefined) {
        var totalSum = 0

        for (var i = 0; i < message.length; i++) {
            totalSum += message.charCodeAt(i)
        }
        if (totalSum%2  == 0) {
            bot.telegram.sendMessage(ctx.chat.id, "This message is true", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
            console.log("[Telegram] sent true for the query: " + message);
            addToLogs("[Telegram] sent true for the query: " + message);
        }
        else {
            bot.telegram.sendMessage(ctx.chat.id, "This message is false", {"reply_to_message_id": ctx.update.message.reply_to_message.message_id});
            console.log("[Telegram] sent false for the query: " + message);
            addToLogs("[Telegram] sent false for the query: " + message);
        }
    } else {
        bot.telegram.sendMessage(ctx.chat.id, "Please reply to a text message", {'reply_to_message_id': ctx.update.message.message_id});
    }
}

function addToLogs(message) {
    fs.appendFile('./logs/logs.txt', message + "\n", err => {
        if (err) {
            console.log(err);
        }
    });
}

function getHelp(commandName, ctx, bot) {
    const commands = [ 'images', 'games', 'r34', 'openai', 'tools' ];
    const commandsPaths = { 'images': './src/telegram_helps/images.txt', 'games': './src/telegram_helps/games.txt', 'r34': './src/telegram_helps/r34.txt', 'openai': './src/telegram_helps/openAI.txt', 'tools': './src/telegram_helps/tools.txt' };

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

module.exports = { addToLogs, isTrue, getHelp };