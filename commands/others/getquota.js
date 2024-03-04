const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUser } = require("../../libs/mysql.js");
const { errorEmbed } = require("../../libs/embeds.js");
const { sendLog } = require("../../libs/logs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getquota")
    .setDescription("Get your current quota.")
    .setDMPermission(false),
  async execute(interaction) {
    const user = await getUser(interaction.user.id).catch((err) => {
      sendLog(err);

      const embed = errorEmbed(
        "An error occured while trying to get your user data."
      );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    });

    if (!user[0]) {
      const embed = errorEmbed("You don't have any quota yet.");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor("#F6C6F9")
      .setTitle("Quota")
      .setDescription(`You have ${0.4 - user[0].quota}$ of credits left.`)
      .setFooter({ text: "Bot by @ninja_jambon" });

    await interaction.reply({ embeds: [embed] });
  },
};
