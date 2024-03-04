const { EmbedBuilder } = require("discord.js");

function errorEmbed(error) {
  return new EmbedBuilder()
    .setTitle("Error")
    .setDescription(error)
    .setColor("#F6C6F9")
    .setFooter({ text: "Bot by @ninja_jambon" });
}

function convBeginEmbed() {
  return new EmbedBuilder()
    .setTitle("Conversation beginning")
    .setDescription(
      "Click on the button below or use the command **/closeconv** to close the conversation."
    )
    .setColor("#F6C6F9")
    .setFooter({ text: "Bot by @ninja_jambon" });
}

function convCreatedEmbed(channelId) {
  return new EmbedBuilder()
    .setTitle("Conversation created")
    .setDescription(`Your conversation has been created at <#${channelId}>.`)
    .setColor("#F6C6F9")
    .setFooter({ text: "Bot by @ninja_jambon" });
}

function requestResponseEmbed(
  user,
  prompt,
  response,
  quota,
  prompt_usage,
  completion_usage
) {
  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL:
        "https://cdn.discordapp.com/avatars/" +
        user.id +
        "/" +
        user.avatar +
        ".jpeg",
    })
    .setTitle(prompt)
    .setDescription(response)
    .setFooter({
      text: `Quota used ${prompt_usage + completion_usage}$ | New quota: ${
        quota + prompt_usage + completion_usage
      }$ | Quota remaining : ${0.4 - prompt_usage - completion_usage}$`,
    })
    .setColor("#F6C6F9");
}

module.exports = {
  errorEmbed,
  convBeginEmbed,
  convCreatedEmbed,
  requestResponseEmbed,
};
