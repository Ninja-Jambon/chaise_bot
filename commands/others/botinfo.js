const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQuotasSum } = require("../../libs/mysql.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Get information about the bot."),
  async execute(interaction) {
    const quotasSum = await getQuotasSum();

    const embed = new EmbedBuilder()
      .setColor("#F6C6F9")
      .setTitle("Bot Info")
      .setDescription("Information about the bot.")
      .addFields(
        {
          name: "Guilds",
          value: interaction.client.guilds.cache.size.toString(),
          inline: false,
        },
        {
          name: "Total quota",
          value: `${quotasSum[0]["SUM(quota)"]}$`,
          inline: false,
        }
      )
      .setFooter({ text: "Bot by @ninja_jambon" });

    interaction.reply({ embeds: [embed] });
  },
};
