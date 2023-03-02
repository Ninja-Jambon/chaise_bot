//Importing libs
const { Telegraf } = require('telegraf');
const fs = require('fs');
const discord = require('discord.js');
const mysql = require('mysql');

//Importing other files
const { getJoke } = require('./libs/dadJokes');
const { rtag, r34 } = require('./libs/rule34');
const { addToLogs, isTrue, image_search, getHelp } = require('./libs/botTools');
const { rockPaperScissorsAgainstBot } = require('./libs/games');
const { generateImage, answerQuestion } = require('./libs/openAi');

//bot initialization
const bot = new Telegraf(process.env.TELEGRAM);
const client = new discord.Client({intents: 3276799});

//mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL,
    database: "discord"
  });

//mysql functions
function addUserToDb(id, user) {
    connection.query('INSERT INTO users(userid, username) VALUES("' + id + '","' + user + '")' , (error, results, fields) => {
        if (error) {
            console.error('Erreur dans la requête : ', error);
        } else {
            console.log('Les résultats de la requête : ', results);
        }
    });

}

function incrementQuota(id) {
    connection.query('UPDATE users SET quota = quota + 1 WHERE userid = ' + id, (error, results, fields) => {
        if (error) {
            console.error('Erreur dans la requête : ', error);
        } else {
            console.log('Les résultats de la requête : ', results);
        }
    });
}

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
        msg.reply("utilise la slash commande enculé")
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


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'gptrequest') {
        await interaction.deferReply();

        connection.query('SELECT userid FROM users', (error, results, fields) => {
            if (error) {
                console.error('Erreur dans la requête : ', error);
            } else {
                var users = [];

                results.forEach(element => {
                    users.push(element.userid);
                });

                if (!(users.includes(interaction.member.user.id))) {
                    addUserToDb(interaction.member.user.id, interaction.member.user.username)
                    addToLogs('[Discord] Added user to the database : ' + interaction.member.user.username);
                    console.log('[Discord] Added user to the database : ' + interaction.member.user.username);
                }
            }
        });

        connection.query('SELECT quota FROM users WHERE userid = '+ interaction.member.user.id, (error, results, fields) => {
            if (error) {
                console.error('Erreur dans la requête : ', error);
            } else {
                if (results[0].quota >= 999) {
                    interaction.editReply('Quota exceeded, please wait');
                }
                else {
                    incrementQuota(interaction.member.user.id);

                    answerQuestion(interaction.options.get('question').value).then((res) => {
                        if (res.data.choices[0].message.content.length > 4096) {
                            interaction.editReply(res.data.choices[0].message.content.lenght);
                            addToLogs('[Discord] Sent answer to : ' +interaction.options.get('question').value);
                            console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                        }
                        else{
                            const embed = new discord.EmbedBuilder()
                                .setColor(0xFABBDE)
                                .setAuthor({ name : "Reply to : " + interaction.member.user.username, iconURL : "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".jpeg"})
                                .setTitle("Question : " + interaction.options.get('question').value)
                                .setDescription(res.data.choices[0].message.content)
                                .setFooter({ text : "Powered by OpenAI https://www.openai.com/", iconURL : "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });
            
                            console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                            addToLogs('[Discord] Sent answer to : ' +interaction.options.get('question').value);
                            interaction.editReply({ embeds : [embed] });
                        }
                    }).catch((err) => {
                        console.log(err);
                        addToLogs(err);
                        interaction.editReply("Something went wrong");
                    })
            
                    console.log('[Discord] Generating answer to : ' + interaction.options.get('question').value);
                    addToLogs('[Discord] Generating answer to : ' + interaction.options.get('question').value);
                }
            }
        });
    }

    else if (interaction.commandName === 'info') {
        console.log(interaction)
    }
});

//bot launch
bot.launch()
client.login(process.env.DISCORD);