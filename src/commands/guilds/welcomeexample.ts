import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { connectToDb, getGuild, getWelcomeConfig } from "../../libs/mysql.js";
import { errorEmbed } from "../../libs/discord.js";
import { createWelcomeImage } from "../../libs/imageGeneration.js"

export default {
	data: new SlashCommandBuilder()
		.setName("welcomeexample")
		.setDescription("Send an example of the welcome message of the server."),
	async execute(interaction: CommandInteraction) {
        await interaction.deferReply()
		const connection = await connectToDb();

        const guild_id = interaction.guild?.id ? interaction.guild?.id : ""

        const guild = await getGuild(connection, guild_id)

        if (!guild[0]) {
            const embed = errorEmbed("Your server must be registered to the bot, use /register to do so.", interaction.client.user.displayAvatarURL());

            return interaction.editReply({embeds: [embed]});
        }

        const member = interaction.guild?.members.cache.get(interaction.user.id)

        if (!member?.permissions.has(PermissionFlagsBits.Administrator) && !member?.roles.cache.has(guild[0].admin_role_id)) {
            const embed = errorEmbed("You are not allowed to use that command.", interaction.client.user.displayAvatarURL());

            return await interaction.editReply({embeds: [embed]});
        }

        const config = await getWelcomeConfig(connection, guild_id);

        connection.end();

        if (!config[0]) {
            const embed = errorEmbed("Your welcome message must be setup before using that command.", interaction.client.user.displayAvatarURL());

            return interaction.editReply({embeds: [embed]});
        }

        const embed = new EmbedBuilder();

        if (config[0].title) {
            embed.setTitle(config[0].title);
        }

        if (config[0].description_format) {
            embed.setDescription(config[0].description_format.replace("{user}", `<@${interaction.user.id}>`).replace("{welcomer}", `<@&${config[0].welcomer_role_id ? config[0].welcomer_role_id : ""}>`));
        }

        if (config[0].vignette_url) {
            embed.setThumbnail(config[0].vignette_url);
        }

        var files = [];

        if (config[0].background_url) {
            const buffer = await createWelcomeImage(config[0].background_url, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.jpeg`, interaction.user.id);

            if (buffer) { 
                const attachement = new AttachmentBuilder(buffer, { name: `${interaction.user.id}.png` })
                files.push(attachement)
                embed.setImage(`attachment://${interaction.user.id}.png`)
            }
        }

        interaction.editReply({content: config[0].message_format ? config[0].message_format.replace("{user}", `<@${interaction.user.id}>`).replace("{welcomer}", `<@&${config[0].welcomer_role_id ? config[0].welcomer_role_id : ""}>`) : "", embeds: [embed], files: files});
	},
};
