import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { connectToDb, getGuild, getWelcomeConfig, addWelcomeConfig, setWelcomePropertiy } from "../../libs/mysql.js";
import { errorEmbed, successEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("setupwelcomemessage")
		.setDescription("Enable a feature of the bot.")
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel where the embed will be sent.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("The role that will be ping if you put {welcomer} in the message or the embed description.")
                .setRequired(false)
        )
        .addStringOption(option => 
            option.setName("message")
                .setDescription("The message that will be sent with the embed.")
                .setRequired(false)
        )
        .addStringOption(option => 
            option.setName("title")
                .setDescription("The title of the embed.")
                .setRequired(false)
        )
        .addStringOption(option => 
            option.setName("description")
                .setDescription("The description of the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("background")
                .setDescription("The url of background of the image of the embed.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("vignette")
                .setDescription("The url of vignette of the embed.")
                .setRequired(false)
        ),
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

        const config = await getWelcomeConfig(connection, guild_id);

        if (!config[0]) {
            await addWelcomeConfig(connection, guild_id);
        }

        const channel_id = interaction.options.getChannel("channel")?.id
        const role_id = interaction.options.getRole("role")?.id
        const message = interaction.options.getString("message")
        const title = interaction.options.getString("title")
        const description = interaction.options.getString("description")
        const background_url = interaction.options.getString("background")
        const vignette_url = interaction.options.getString("vignette")

        setWelcomePropertiy(connection, guild_id, "channel_id", channel_id ? channel_id : "");

        if (role_id) {
            setWelcomePropertiy(connection, guild_id, "welcomer_role_id", role_id);
        }

        if (message) {
            setWelcomePropertiy(connection, guild_id, "message_format", message);
        }

        if (title) {
            setWelcomePropertiy(connection, guild_id, "title", title);
        }

        if (description) {
            setWelcomePropertiy(connection, guild_id, "description_format", description);
        }

        if (background_url) {
            setWelcomePropertiy(connection, guild_id, "background_url", background_url);
        }

        if (vignette_url) {
            setWelcomePropertiy(connection, guild_id, "vignette_url", vignette_url);
        }

        connection.end();

        const embed = successEmbed("Your welcome message has been successfully setup.", interaction.client.user.displayAvatarURL());

        interaction.reply({embeds: [embed]});
	},
};
