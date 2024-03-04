const { SlashCommandBuilder } = require("discord.js");
//const { sendConv } = require("../../libs/mistralAiFunctions");
//const data = require("../../data.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mistral")
    .setDescription("Talk to Mistral AI")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("medium")
        .setDescription("Talk to Mistral AI using the medium model")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("What do you want to say to Mistral AI?")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    /*if (interaction.options.getSubcommand() === "medium") {
      const message = interaction.options.getString("message");
      messages = [
        { role: system, text: data.prompt },
        { role: user, text: message },
      ];
      const chatResponse = await sendConv(messages);
      console.log(chatResponse);
      await interaction.reply(chatResponse);
    }*/
  },
};
