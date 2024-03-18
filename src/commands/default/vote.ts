import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Send the top.gg voting link")
		.setDMPermission(true),
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle("Voting link")
			.setURL("https://top.gg/bot/1059559067846189067/vote")
			.setDescription("You can vote for Odin using this [link](https://top.gg/bot/1059559067846189067/vote).\nThank you !")
			.setFooter({ text: "Bot by @ninja_jambon.", iconURL: interaction.client.user.displayAvatarURL()})
			.setColor("#000000");

		interaction.reply({ embeds: [ embed ] });
	},
};
