import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("botinfo")
		.setDescription("Get the infos about the bot")
		.setDMPermission(true),
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("Bot infos")
			.setDescription(
`
- Servers : ${interaction.client.guilds.cache.size}
- Users : ${interaction.client.users.cache.size}
`
			)
			.setFooter({ text: "Bot by @ninja_jambon.", iconURL: interaction.client.user.displayAvatarURL()})
			.setColor("#000000");

		interaction.reply({ embeds: [ embed ] });
	},
};
