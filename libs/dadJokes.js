const request = require('request');

function getJoke(ctx, bot) {
    const options = {
        method: 'GET',
        url: 'https://dad-jokes.p.rapidapi.com/random/joke',
        headers: {
            'X-RapidAPI-Key': process.env.DADJOKES,
            'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
            useQueryString: true
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        res = JSON.parse(body)
        
        bot.telegram.sendMessage(ctx.chat.id, res.body[0].setup, {});

        setTimeout(() => {
        bot.telegram.sendMessage(ctx.chat.id, res.body[0].punchline, {});
        }, 500);
    });
}

module.exports = { getJoke };