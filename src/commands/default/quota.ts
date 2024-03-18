import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { connectToDb, getUser } from "../../libs/mysql.js";
import { errorEmbed, quotaEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("quota")
		.setDescription("Send you quota")
		.setDMPermission(false),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply();

		const connection = await connectToDb();

		const user: any[] = await getUser(connection, interaction.member?.user.id ? interaction.member?.user.id : "");

		connection.end();

		if (!user[0]) {
			return interaction.editReply({ embeds: [ errorEmbed("Try asking something to the bot before requesting your quota.", interaction.client.user.displayAvatarURL()) ] });
		}

		interaction.editReply({ embeds: [ quotaEmbed(user[0].quota, interaction.client.user.displayAvatarURL()) ] });
	},
};
