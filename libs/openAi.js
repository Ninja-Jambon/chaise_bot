const { Configuration, OpenAIApi } = require("openai");
const { addToLogs } = require('./botTools');

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

function generateImage(query, ctx, bot) {
  const image = openai.createImage({
    prompt: query,
    n: 1,
    size: "1024x1024",
    response_format : 'url'
  }).catch((err) => {
    console.log(err);
    addToLogs("--> error : " + err);
    bot.telegram.sendMessage(ctx.chat.id, "Something went wrong", {});
  });

  console.log("--> generating image for the querry " + query);
  addToLogs("--> generating image for the querry " + query)
  bot.telegram.sendMessage(ctx.chat.id, "Generating the image.", {});

  image.then((res) => {
    url = res.data.data[0].url

    bot.telegram.sendPhoto(ctx.chat.id, url, {"caption": "This is a generated image for the querry : " + query}).catch((err) => {
      bot.telegram.sendMessage(ctx.chat.id, "Something went wrong.", {});
      console.log("--> error while sending the image : " + err);
    })
  })
}

function answerQuestion(query, ctx, bot) {
  response = openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    max_tokens: 500,
    temperature: 0.9,
  }).catch((err) => {
    console.log(err);
  })

  console.log("--> answering the question " + query);
  addToLogs("--> answering the question " + query)
  bot.telegram.sendMessage(ctx.chat.id, "Generating the answer.", {});
  
  response.then((res) => {
    const text = res.data.choices[0].text.slice(+2);

    bot.telegram.sendMessage(ctx.chat.id, text, {}).catch((err) => {
      bot.telegram.sendMessage(ctx.chat.id, "Something went wrong.", {});
      console.log("--> error while sending the answer : " + err);
    })
  })
}

module.exports = { generateImage, answerQuestion };