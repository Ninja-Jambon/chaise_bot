const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { getConvs } = require('../../libs/mysql');

async function listconvs(interaction, client) {
    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });
    message = "";
    if (convs.length == 0) {
        message = "No conversations in the database";
    } else {
        convs.forEach(element => {
            message += "- **" + element + "**\n\n";
        });
    }

    const embed = new discord.EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Conversations list", iconURL: client.user.displayAvatarURL() })
        .setDescription(message)
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.reply({ embeds: [embed] });

    addToLogs('[Discord] Sent conversations list');
    console.log('[Discord] Sent conversations list');
}

module.exports = listconvs;