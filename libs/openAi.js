const { Configuration, OpenAIApi } = require("openai");
const prompt = require("../data/prompt.json").prompt;

const configuration = new Configuration({
  apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

async function answerQuestion(query) {
  return new Promise((resolve, reject) => {
    openai
      .createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: query },
        ],
        temperature: 0.9,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function quickAnswer(query) {
  return new Promise((resolve, reject) => {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: query },
        ],
        temperature: 0.9,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function sendConv(messages) {
  return new Promise((resolve, reject) => {
    openai
      .createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: messages,
        temperature: 0.9,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function sendQuickConv(messages) {
  return new Promise((resolve, reject) => {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        temperature: 0.9,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { answerQuestion, sendConv, quickAnswer, sendQuickConv };
