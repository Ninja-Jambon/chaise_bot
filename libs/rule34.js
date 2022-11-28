//
// Rule34 Fuctions for the Rule34 Bot
//

const https = require('https');

const { addToLogs } = require('./botTools');

const blockedChannels = [ -1001845876532 ];

function rtag(query, ctx, bot) {

    if (blockedChannels.includes(ctx.chat.id)) {
        bot.telegram.sendMessage(ctx.chat.id, "This command is disabled in this channel", {});
        return;
    }
    
    console.log("--> r34sTag query: " + query);
    addToLogs("--> r34sTag query: " + query);
    https.get("https://rule34.xxx/public/autocomplete.php?q=" + query, (resp) => {
        let data = '';
            
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res = JSON.parse(data);
            message = "Tags for the query " + query + " :\n" ;

            if (res.length == 0) {
                console.log("--> no tags found for the query: " + query);
                addToLogs("--> no tags found for the query: " + query);
                bot.telegram.sendMessage(ctx.chat.id, "No tags found for the query: " + query, {});
            } else {
                for (var i = 0; i < res.length; i++) {
                    message += "\n  - `" + res[i].value+"`";
                }
                message += "\n\nUse `/r34 <tag>` to get a random image for the tag" + "\nExample: `/r34 " + res[0].value + "`";
                bot.telegram.sendMessage(ctx.chat.id, message, {parse_mode: "Markdown"});
                console.log("--> sent the tags for the query: " + query);
                addToLogs("--> sent the tags for the query: " + query);
            }
        });

    }).on("error", (err) => {
        console.log(err);
        addToLogs("--> error : " + err);
    })
}

function r34(tag, ctx, bot) {
    //
    //Search for the tag on r34 and send a random image
    //

    if (blockedChannels.includes(ctx.chat.id)) {
        bot.telegram.sendMessage(ctx.chat.id, "This command is disabled in this channel", {});
        return;
    }
    console.log("--> r34 query: " + tag);
    addToLogs("--> r34 query: " + tag);
    https.get('https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=' + tag, (resp) => {
        let data = '';
        
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            if (data == "") {
                console.log("--> no images found for the query: " + tag);
                addToLogs("--> no images found for the query: " + tag);
                bot.telegram.sendMessage(ctx.chat.id, "No images found for the query: " + tag + "\nUse /r34tag command to find a tag before searching an image", {});
            } else {
                res = JSON.parse(data);

                bot.telegram.sendPhoto(ctx.chat.id, res[Math.floor(Math.random() * res.length)].file_url, {"caption": "This is a random image for the tag : " + tag}).catch(err => {
                    console.log(err);
                    addToLogs("--> error : " + err);
                    bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
                });
            }
        });
        
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        addToLogs("--> error : " + err);
        bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
    });
}

module.exports = { rtag, r34 };