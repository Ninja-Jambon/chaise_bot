const { SlashCommandBuilder } = require("discord.js");
const {
  getUser,
  registerUser,
  incrementQuota,
} = require("../../libs/mysql.js");
const { answerQuestion } = require("../../libs/openAi.js");
const { checkLastResetDate } = require("../../libs/quotaReset.js");
const { requestResponseEmbed, errorEmbed } = require("../../libs/embeds.js");
const { sendLog } = require("../../libs/logs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gptrequest")
    .setDescription("Make a single request to the GPT-4 API.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to send to the API.")
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.deferReply();
    await checkLastResetDate();
    user = await getUser(interaction.user.id).catch((err) => {
      sendLog(err);

      const embed = errorEmbed(
        "An error occured while trying to get your user data."
      );

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });

    if (!user[0]) {
      await registerUser(interaction.user.username, interaction.user.id).catch(
        (err) => {
          sendLog(err);

          const embed = errorEmbed(
            "An error occured while trying to register you in our database."
          );

          return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      );

      user = await getUser(interaction.user.id).catch((err) => {
        sendLog(err);

        const embed = errorEmbed(
          "An error occured while trying to get your user data."
        );

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      });
    }

    if (user[0].quota >= 0.4) {
      const embed = errorEmbed(
        "You don't have enough quota to use this command."
      );

      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    response = await answerQuestion(
      interaction.options.getString("prompt")
    ).catch((err) => {
      sendLog(err);

      const embed = errorEmbed(
        "An error occured while trying to send the request to the API."
      );

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });

    const prompt_usage = (response.data.usage.prompt_tokens * 0.01) / 1000;
    const completion_usage =
      (response.data.usage.completion_tokens * 0.03) / 1000;

    await incrementQuota(
      interaction.user.id,
      prompt_usage + completion_usage
    ).catch((err) => {
      sendLog(err);

      const embed = errorEmbed(
        "An error occured while trying to increment your quota."
      );

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });

    const embed = requestResponseEmbed(
      interaction.user,
      interaction.options.getString("prompt"),
      response.data.choices[0].message.content,
      user[0].quota,
      prompt_usage,
      completion_usage
    );

    await interaction.editReply({ embeds: [embed] });
  },
};
