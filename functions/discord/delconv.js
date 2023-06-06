const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { delConv, getConvs } = require('../../libs/mysql');

async function delconv(interaction, client) {
    await interaction.deferReply();

    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });
    if (!convs.includes(interaction.options.get('name').value)) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation not found in the database")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
        console.log('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
    } else {
        await delConv(interaction.options.get('name').value);
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation deleted", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation " + interaction.options.get('name').value + " deleted from the database")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
        console.log('[Discord] Conversation deleted from the database : ' + interaction.options.get('name').value);
    }
}

module.exports = delconv;