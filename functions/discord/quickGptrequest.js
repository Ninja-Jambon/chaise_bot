const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { quickAnswer } = require('../../libs/openAi');
const { incrementQuota, isNewUser } = require('../../libs/mysql');

async function quickGptrequest(interaction, client) {
    await interaction.deferReply();

    quota = await isNewUser(interaction.member.user.id, interaction.member.user.username).catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (quota.quota >= 200000) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
            .setDescription("You have a quota of " + quota.quota + " tokens, please wait until reset (every months)")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
    }
    else {
        quickAnswer(interaction.options.get('question').value).then((res) => {
            incrementQuota(interaction.member.user.id, res.data.usage.total_tokens).catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            if (res.data.choices[0].message.content.length > 4096) {
                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Reply to : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                    .setTitle("Question : " + interaction.options.get('question').value)
                    .setDescription("The answer is too long to be displayed, please try again with a shorter question.")
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                addToLogs('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                interaction.editReply({ embeds: [embed] });
            }
            else {
                title = "Question : " + interaction.options.get('question').value;

                if (title.length > 256) {
                    title = title.slice(0, 253) + "...";
                }

                const embed = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Reply to : " + interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                    .setTitle(title)
                    .setDescription(res.data.choices[0].message.content)
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                console.log('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                addToLogs('[Discord] Sent answer to : ' + interaction.options.get('question').value);
                interaction.editReply({ embeds: [embed] });
            }
        }).catch((err) => {
            console.log(err);
            addToLogs(err);
            interaction.editReply("Something went wrong");
        })

        console.log('[Discord] Generating answer to : ' + interaction.options.get('question').value);
        addToLogs('[Discord] Generating answer to : ' + interaction.options.get('question').value);
    }
}

module.exports = quickGptrequest;