import { SlashCommandBuilder, CommandInteraction, PermissionsBitField } from "discord.js";
import { connectToDb, getGuild, addGuild } from "../../libs/mysql.js"
import { errorEmbed, successEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Register the guild to the bot.")
        .setDMPermission(false),
	async execute(interaction: CommandInteraction) {
        const guild_id: string = interaction.guildId ? interaction.guildId : "";
        const member = interaction.guild?.members.cache.get(interaction.user.id);

        if (!member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = errorEmbed("You are not allowed to use that command.", interaction.client.user.displayAvatarURL());

            return await interaction.reply({embeds: [embed]});
        }

        const connection = await connectToDb();

        const guild: any[] = await getGuild(connection, guild_id);

        if (guild[0]) {
            const embed = await errorEmbed("Your server is already registered.", interaction.client.user.displayAvatarURL());

            return await interaction.reply({embeds: [embed]});
        }

        await addGuild(connection, guild_id);

        connection.end();

        const embed = await successEmbed("your server has been added to the bot.", interaction.client.user.displayAvatarURL());

		await interaction.reply({embeds: [embed]});
	},
};
