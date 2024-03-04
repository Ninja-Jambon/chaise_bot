const { SlashCommandBuilder } = require("discord.js");
const { getConv, removeConv } = require("../../libs/mysql.js");
const { errorEmbed } = require("../../libs/embeds.js");
const { sendLog } = require("../../libs/logs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("closeconv")
    .setDescription("Close the current conversation.")
    .setDMPermission(false),
  async execute(interaction) {
    const conv = await getConv(interaction.channelId).catch((err) => {
      sendLog(err);

      const embed = errorEmbed(
        "An error occured while trying to get your conversation data."
      );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    });

    if (!conv[0]) {
      const embed = errorEmbed("This channel is not a conversation.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (conv[0].userid != interaction.user.id) {
      const embed = errorEmbed("You are not the owner of this conversation.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    var channel = interaction.guild.channels.cache.get(interaction.channelId);

    await removeConv(channel.id);
    await channel.delete();
  },
};
