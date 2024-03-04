const { EmbedBuilder, WebhookClient } = require("discord.js");

const webhookClient = new WebhookClient({
  url: `https://discord.com/api/webhooks/1187067107054202961/M7bsyOwFPMXQTMB8tvrWZu-gLT9rSjl1NASOBrz-z4lwvbwQ9To_yAywE_4aj5oGBP0D`,
});

function sendLog(message) {
  const embed = new EmbedBuilder()
    .setTitle("Log")
    .setDescription(message)
    .setColor(0x00ffff);

  webhookClient.send({
    embeds: [embed],
  });
}

module.exports = {
  sendLog,
};
