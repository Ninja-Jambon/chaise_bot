const { Configuration, OpenAIApi } = require("openai");
const { addToLogs } = require("./botTools");

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

async function generateImage(query, ctx, bot) {
  const image = await openai.createImage({
    prompt: query,
    n: 1,
    size: "1024x1024",
    response_format : 'url'
  }).catch((err) => {
    console.log(err);
    addToLogs("--> error : " + err);
  });
    
  return image;
}

async function answerQuestion(query) {
  response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{"role":"system", "content" : "You are a helpful assistant."},{ "role" : "user", "content" : "who is the president of the united states?" }, { "role" : "assistant", "content" : "Joe Biden"}],
    temperature: 0.9,
  }).catch((err) => {
    console.log(err);
    addToLogs("--> error : " + err);
  })
  
  console.log(response);
  return response;
}

async function sendConv (messages) {
  response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.9,
  }).catch((err) => {
    console.log(err);
    addToLogs("--> error : " + err);
  })
  
  return response;
}

module.exports = { generateImage, answerQuestion, sendConv };