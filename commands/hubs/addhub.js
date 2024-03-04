const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const { errorEmbed } = require("../../libs/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addhub")
    .setDescription("Add a conversation hub to the database.")
    .setDMPermission(false),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = errorEmbed(
        "You need the administrator permission to use this command."
      );
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setTitle("Conversation hub")
      .setDescription("Click on the button below to create a conversation.")
      .setColor("#F6C6F9")
      .setFooter({ text: "Bot by @ninja_jambon" });

    const button = new ButtonBuilder()
      .setCustomId("create_conversation")
      .setLabel("Create conversation")
      .setStyle(ButtonStyle.Success);

    const actionRow = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [actionRow] });
  },
};
