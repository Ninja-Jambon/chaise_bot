import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { connectToDb, getGuild, setFeature } from "../../libs/mysql.js";
import { errorEmbed, successEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("enablefeature")
		.setDescription("Enable a feature of the bot.")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("feature")
                .setDescription("The feature to be enabled.")
                .setRequired(true)
                .addChoices([
                    {name: "Welcome message", value: "welcome_message"},
                    {name: "Goodbye message", value: "bye_message"},
                ])),
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

        const feature: string | null = interaction.options.getString("feature")

        setFeature(connection, guild_id, feature ? feature : "", "true");

        const embed = successEmbed("The feature has been successfully activated.", interaction.client.user.displayAvatarURL())

        interaction.reply({embeds: [embed]})
	},
};
