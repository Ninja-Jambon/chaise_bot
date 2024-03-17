import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getChatResponse, MistralMessage, Models, InputPrice, OutputPrice, ReturnedValue, Prompts } from "../../libs/mistralai.js";
import { User, connectToDb, addUser, getUser, incrementQuota } from "../../libs/mysql.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Make a single request to mistral API")
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName("prompt").setDescription("The prompt to send to the API").setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.member?.user.id == undefined) {
			return;
		}

		await interaction.deferReply();

		const connection = await connectToDb();

		var user: User[] = await getUser(connection, interaction.member?.user.id);

		if (!user[0]) {
			await addUser(connection, interaction.member?.user.username, interaction.member?.user.id);
			user = await getUser(connection, interaction.member?.user.id);
		}

		if (user[0].quota > 0.4) {
			interaction.editReply("You have exceed your quota.")
			connection.end();
			return;
		}

		const prompt: string | null = interaction.options.getString("prompt");

		const messages: MistralMessage[] = [
			{
				role: "system",
				content: Prompts.default
			},
			{
				role: "user",
				content: prompt ? prompt : ""
			},
		]

		const response: ReturnedValue = await getChatResponse(messages, Models.multi_tiny);

		await incrementQuota(connection, interaction.member?.user.id, InputPrice.multi_tiny * response.promptUsage + OutputPrice.multi_tiny * response.responseUsage);
		connection.end();

		interaction.editReply(response.message);
	},
};
