import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { connectToDb, getGuild } from "../../libs/mysql.js";
import { errorEmbed, successEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("setupwelcomemessage")
		.setDescription("Enable a feature of the bot.")
        .setDMPermission(false),
	async execute(interaction: ChatInputCommandInteraction) {
		const connection = await connectToDb();

        const guild_id = interaction.guild?.id ? interaction.guild?.id : ""

        const guild = await getGuild(connection, guild_id)

        if (!guild[0]) {
            const embed = errorEmbed("Your server must be registered to the bot, use /register to do so.", interaction.client.user.displayAvatarURL());

            return interaction.reply({embeds: [embed]});
        }

        const member = interaction.guild?.members.cache.get(interaction.user.id)

        if (!member?.permissions.has(PermissionFlagsBits.Administrator) && !member?.roles.cache.has(guild[0].admin_role_id)) {
            const embed = errorEmbed("You are not allowed to use that command.", interaction.client.user.displayAvatarURL());

            return await interaction.reply({embeds: [embed]});
        }
	},
};
