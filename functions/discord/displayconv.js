const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { getConvs, getMessages } = require('../../libs/mysql');

async function displayconv(interaction, client) {
    await interaction.deferReply();

    if (interaction.options.get('name').value.includes(" ")) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Conversation name can't contain spaces")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Conversation name can\'t contain spaces');
        console.log('[Discord] Conversation name can\'t contain spaces');
    } else {
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

            addToLogs('[Discord] Conversation not found in the database');
            console.log('[Discord] Conversation not found in the database');
        }

        messages = await getMessages(interaction.options.get('name').value, "user").catch((err) => {
            console.log(err);
            addToLogs(err);
        });

        embed_text = "";

        messages.forEach(element => {
            if (element.user == "System") { }
            else {
                embed_text += "**" + element.user + "** : " + element.content + "\n\n";
            }
        });

        if (embed_text.length > 4096) {
            embed_text = "Conversation too long to display";
        }

        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Conversation : " + interaction.options.get('name').value, iconURL: client.user.displayAvatarURL() })
            .setDescription(embed_text)
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
        console.log('[Discord] Displayed conversation : ' + interaction.options.get('name').value);
    }
}

module.exports = displayconv;