const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { isNewUser } = require('../../libs/mysql');

async function getmyguota(interaction) {
    await interaction.deferReply();

    quota = (await isNewUser(interaction.member.user.id, interaction.member.user.username).catch((error) => {
        console.log(error);
        addToLogs(error);
    })).quota;

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Quota : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
        .setDescription("You have " + (200000 - quota) + " tokens left this month")
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.editReply({ embeds: [embed] });

    addToLogs('[Discord] Quota requested by ' + interaction.member.user.username);
    console.log('[Discord] Quota requested by ' + interaction.member.user.username);
}

module.exports = getmyguota ;