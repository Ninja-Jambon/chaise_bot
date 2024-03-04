const { Events, EmbedBuilder } = require("discord.js");
const {
  getConv,
  getUser,
  registerUser,
  incrementQuota,
} = require("../libs/mysql.js");
const { sendQuickConv, quickAnswer } = require("../libs/openAi.js");
const { checkLastResetDate } = require("../libs/quotaReset.js");
const prompt = require("../data/prompt.json").prompt;
require("dotenv").config();
const { errorEmbed } = require("../libs/embeds.js");
const { sendLog } = require("../libs/logs.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    conv = await getConv(message.channel.id);

    if (!message.guildId && message.author.id != "1059559067846189067") {
      await checkLastResetDate();
      user = await getUser(message.author.id).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to get your data from the database."
        );
        return message.reply({ embeds: [embed] });
      });

      if (!user[0]) {
        await registerUser(message.author.username, message.author.id).catch(
          (err) => {
            sendLog(err);
            const embed = errorEmbed(
              "An error occured while trying to register you in the database."
            );
            return message.reply({ embeds: [embed] });
          }
        );

        user = await getUser(message.author.id).catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while trying to get your data from the database."
          );
          return message.reply({ embeds: [embed] });
        });
      }

      if (user[0].quota >= 0.4)
        return await message.reply({
          content: "You don't have enough quota to talk with the bot.",
          ephemeral: true,
        });

      discordMessages = await message.channel.messages.fetch().catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to fetch the messages from the channel."
        );
        return message.reply({ embeds: [embed] });
      });

      discordMessages.filter((message) => message.content);
      messages = [];
      var i = 0;
      discordMessages.forEach(async (message) => {
        if (i == 6) return;
        if (message.author.id == "1059559067846189067") {
          messages.push({ role: "assistant", content: message.content });
          i++;
        } else {
          messages.push({ role: "user", content: message.content });
          i++;
        }
      });
      messages.reverse();
      messages.unshift({ role: "system", content: prompt });

      message.channel.sendTyping().catch((err) => {
        sendLog(err);
      });

      const response = await sendQuickConv(messages).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to send the request to the API."
        );
        return message.reply({ embeds: [embed] });
      });

      const prompt_usage = (response.data.usage.prompt_tokens * 0.001) / 1000;
      const completion_usage =
        (response.data.usage.completion_tokens * 0.002) / 1000;

      await incrementQuota(
        message.author.id,
        prompt_usage + completion_usage
      ).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to increment your quota."
        );
        return message.reply({ embeds: [embed] });
      });

      if (response.data.choices[0].message.content.length <= 2000) {
        await message.reply(response.data.choices[0].message.content);
      } else {
        let paragraphs = response.data.choices[0].message.content.split("\n");
        messageText = "";

        paragraphs.forEach((paragraph) => {
          if (`${messageText}${paragraph}`.length > 2000) {
            message.reply(messageText);
            messageText = `${paragraph}\n`;
          } else {
            messageText += `${paragraph}\n`;
          }
        });
      }
    } else if (
      message.content.includes(`<@${process.env.BOT_ID}>`) ||
      (message.mentions.repliedUser &&
        message.mentions.repliedUser.id == process.env.BOT_ID)
    ) {
      await checkLastResetDate();
      user = await getUser(message.author.id).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to get your data from the database."
        );
        return message.reply({ embeds: [embed] });
      });

      if (!user[0]) {
        await registerUser(message.author.username, message.author.id).catch(
          (err) => {
            sendLog(err);
            const embed = errorEmbed(
              "An error occured while trying to register you in the database."
            );
            return message.reply({ embeds: [embed] });
          }
        );

        user = await getUser(message.author.id).catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while trying to get your data from the database."
          );
          return message.reply({ embeds: [embed] });
        });
      }

      if (user[0].quota >= 0.4)
        return await message.reply({
          content: "You don't have enough quota to use this command.",
          ephemeral: true,
        });

      message.channel.sendTyping().catch((err) => {
        sendLog(err);
      });

      response = await quickAnswer(message.content).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to send the request to the API."
        );
        return message.reply({ embeds: [embed] });
      });

      const prompt_usage = (response.data.usage.prompt_tokens * 0.01) / 1000;
      const completion_usage =
        (response.data.usage.completion_tokens * 0.03) / 1000;

      await incrementQuota(
        message.author.id,
        prompt_usage + completion_usage
      ).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to increment your quota."
        );
        return message.reply({ embeds: [embed] });
      });

      if (response.data.choices[0].message.content.length <= 2000) {
        await message.reply({
          content: response.data.choices[0].message.content,
        });
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Answer")
          .setDescription(response.data.choices[0].message.content)
          .setColor("#F6C6F9")
          .setFooter({ text: "Bot by @ninja_jambon" });

        await message.reply({ embeds: [embed] });
      }
    } else if (
      conv[0] &&
      message.author.id != "1059559067846189067" &&
      conv[0].userid == message.author.id
    ) {
      await checkLastResetDate();
      user = await getUser(message.author.id).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to get your data from the database."
        );
        return message.reply({ embeds: [embed] });
      });

      if (!user[0]) {
        await registerUser(message.author.username, message.author.id).catch(
          (err) => {
            sendLog(err);
            const embed = errorEmbed(
              "An error occured while trying to register you in the database."
            );
            return message.reply({ embeds: [embed] });
          }
        );

        user = await getUser(message.author.id).catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while trying to get your data from the database."
          );
          return message.reply({ embeds: [embed] });
        });
      }

      if (user[0].quota >= 0.4)
        return await message.reply({
          content: "You don't have enough quota to talk with the bot.",
          ephemeral: true,
        });

      discordMessages = await message.channel.messages.fetch().catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to fetch the messages from the channel."
        );
        return message.reply({ embeds: [embed] });
      });

      discordMessages.filter(
        (message) =>
          (message.author.id == "1059559067846189067" ||
            message.author.id == conv[0].userid) &&
          message.content
      );
      messages = [];
      var i = 0;
      discordMessages.forEach(async (message) => {
        if (i == 6) return;
        if (message.author.id == "1059559067846189067") {
          messages.push({ role: "assistant", content: message.content });
          i++;
        } else if (message.author.id == conv[0].userid) {
          messages.push({ role: "user", content: message.content });
          i++;
        }
      });
      messages.reverse();
      messages.unshift({ role: "system", content: prompt });

      message.channel.sendTyping().catch((err) => {
        sendLog(err);
      });

      const response = await sendQuickConv(messages).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to send the request to the API."
        );
        return message.reply({ embeds: [embed] });
      });

      const prompt_usage = (response.data.usage.prompt_tokens * 0.001) / 1000;
      const completion_usage =
        (response.data.usage.completion_tokens * 0.002) / 1000;

      await incrementQuota(
        message.author.id,
        prompt_usage + completion_usage
      ).catch((err) => {
        sendLog(err);
        const embed = errorEmbed(
          "An error occured while trying to increment your quota."
        );
        return message.reply({ embeds: [embed] });
      });

      if (response.data.choices[0].message.content.length <= 2000) {
        await message.reply(response.data.choices[0].message.content);
      } else {
        let paragraphs = response.data.choices[0].message.content.split("\n");
        messageText = "";

        paragraphs.forEach((paragraph) => {
          if (`${messageText}${paragraph}`.length > 2000) {
            message.reply(messageText);
            messageText = `${paragraph}\n`;
          } else {
            messageText += `${paragraph}\n`;
          }
        });
      }
    }
  },
};
