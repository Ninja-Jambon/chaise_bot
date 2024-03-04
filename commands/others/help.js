const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help about the bot."),
  async execute(interaction) {
    const helpMessage = `
**Single requests:**
- **/quickgpt**: Make a single request to the GPT-3.5 Turbo model.
- **/gptrequest**: Make a single request to the GPT-4 model.

**Conversations:**
- **/addhub**: Add a conversation hub to the channel, user needs to have the ADMINISTRATOR permission and the channel needs to be a forum channel or a normal text channel.
- **/closeconv**: Close the conversation in your channel, user needs to be the creator of the conversation.

**Others:**
- **/getquota**: Display your quota, you can use a total of 0.4$ of quota per month.
- **/botinfo**: Display information about the bot.

**Links:**
- [Invite the bot](https://discord.com/api/oauth2/authorize?client_id=1059559067846189067&permissions=326417632256&scope=bot)
- [Support server](https://discord.gg/WcZPz3nm5p)
`;

    const embed = new EmbedBuilder()
      .setColor("#F6C6F9")
      .setTitle("Help")
      .setDescription(helpMessage)
      .setFooter({ text: "Bot by @ninja_jambon" });

    interaction.reply({ embeds: [embed] });
  },
};
