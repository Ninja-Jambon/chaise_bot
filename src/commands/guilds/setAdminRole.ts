import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { connectToDb, getGuild, setAdminRole } from "../../libs/mysql.js"
import { errorEmbed, successEmbed } from "../../libs/discord.js";


export default {
	data: new SlashCommandBuilder()
		.setName("setadminrole")
		.setDescription("Set the admin role for the bot")
        .addRoleOption(option => option.setName("role").setDescription("The role to be admin.").setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const guild_id: string = interaction.guildId ? interaction.guildId : "";
        const member = interaction.guild?.members.cache.get(interaction.user.id);

        if (!member?.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = errorEmbed("You are not allowed to use that command.", interaction.client.user.displayAvatarURL());

            return await interaction.reply({embeds: [embed]});
        }

        const connection = await connectToDb();

        const guild: any[] = await getGuild(connection, guild_id);

        if (!guild[0]) {
            const embed = errorEmbed("Your server must be registered to the bot, use /register to do so.", interaction.client.user.displayAvatarURL());

            return interaction.reply({embeds: [embed]});
        }

        const role_id: string | undefined = interaction.options.getRole("role")?.id

        await setAdminRole(connection, guild_id, role_id ? role_id : "");

        const embed = successEmbed("The bot admin role has been successfully changed.", interaction.client.user.displayAvatarURL())

        interaction.reply({embeds: [embed]})
	},
};
