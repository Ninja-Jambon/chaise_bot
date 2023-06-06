const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { addConv, getConvs } = require('../../libs/mysql');

async function addconv(interaction, client) {
    await interaction.deferReply();
    convs = await getConvs().catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (!interaction.options.get('name').value.includes(" ") && !convs.includes(interaction.options.get('name').value)) {
        await addConv(interaction.options.get('name').value);
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation added", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation " + interaction.options.get('name').value + " added to db")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Added conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Added conversation : ' + interaction.options.get('name').value);
    } else {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Verify the name of the conversation (it must not contain spaces and must be unique).")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Error adding conversation : ' + interaction.options.get('name').value);
    }
}

module.exports = addconv;