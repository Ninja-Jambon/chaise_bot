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

module.exports = { generateImage };