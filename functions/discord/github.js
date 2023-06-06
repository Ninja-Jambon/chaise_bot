const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');

async function github(interaction, client) {
    await interaction.deferReply();

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Github", iconURL: client.user.displayAvatarURL() })
        .setDescription('Link of the Gihhub repository :\n  https://github.com/Ninja-Jambon/chaise_bot')
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.editReply({ embeds: [embed] });

    addToLogs('[Discord] Github requested by ' + interaction.member.user.username);
    console.log('[Discord] Github requested by ' + interaction.member.user.username);
}

module.exports = github;