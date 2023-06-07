const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { generateImage } = require('../../libs/openAi');
const { isNewUser, incrementQuota } = require('../../libs/mysql');

async function dalle (interaction, client) {
    await interaction.deferReply();

    quota = await isNewUser(interaction.member.user.id, interaction.member.user.username).catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (quota >= 200000) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
            .setDescription("You have a quota of " + quota + " tokens, please wait until reset (every months)")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
    }
    else {
        const response = await generateImage(interaction.options.getString('query')).catch((err) => {
            interaction.editReply("Something went wrong");
            console.log(err);
            addToLogs('--> error : ' + err);
        });

        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Image generated for : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
            .setTitle("Query : " + interaction.options.get('query').value)
            .setImage(response.data.data[0].url)
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        incrementQuota(interaction.member.user.id, 10000).catch((err) => {
            console.log(err);
            addToLogs(err);
        });
    }
}

module.exports = dalle;