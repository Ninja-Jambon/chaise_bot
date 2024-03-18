import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { helpEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Send the help message"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply({ embeds: [ helpEmbed(interaction.client.user.displayAvatarURL()) ] });
	},
};
