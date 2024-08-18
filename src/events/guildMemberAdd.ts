import { Events, GuildMember, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { connectToDb, getGuild, getWelcomeConfig } from "../libs/mysql.js";
import { createWelcomeImage } from "../libs/imageGeneration.js"

export default {
	name: Events.GuildMemberAdd,
	async execute(member: GuildMember ) {
		const connection = await connectToDb();
        const guild = await getGuild(connection, member.guild.id);
        const config = await getWelcomeConfig(connection, member.guild.id);

        if (guild[0]?.welcome_message && config[0]) {
            const embed = new EmbedBuilder();

            if (config[0].title) {
                embed.setTitle(config[0].title);
            }
    
            if (config[0].description_format) {
                embed.setDescription(config[0].description_format.replace("{user}", `<@${member.user.id}>`).replace("{welcomer}", `<@&${config[0].welcomer_role_id ? config[0].welcomer_role_id : ""}>`));
            }
    
            if (config[0].vignette_url) {
                embed.setThumbnail(config[0].vignette_url);
            }
    
            var attachement;
            var buffer;
            var files = [];
    
            if (config[0].background_url) {
                buffer = await createWelcomeImage(config[0].background_url, `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpeg`, member.user.id);
                attachement = new AttachmentBuilder(buffer, { name: `${member.user.id}.png` })
                files.push(attachement)
                embed.setImage(`attachment://${member.user.id}.png`)
            }
    
            const channel = member.guild.channels.cache.get(config[0].channel_id);

            if (channel?.isTextBased()) {
                channel.send({content: config[0].message_format ? config[0].message_format.replace("{user}", `<@${member.user.id}>`).replace("{welcomer}", `<@&${config[0].welcomer_role_id ? config[0].welcomer_role_id : ""}>`) : "", embeds: [embed], files: files});
            }
        }
	},
};