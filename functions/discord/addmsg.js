const discord = require('discord.js');

const { addToLogs } = require('../../libs/botTools');
const { sendConv } = require('../../libs/openAi');
const { getConvs, addMessage, getMessages, isNewUser, incrementQuota } = require('../../libs/mysql');

async function addmsg(interaction, client) {
    await interaction.deferReply();

    quota = await isNewUser(interaction.member.user.id, interaction.member.user.username).catch((err) => {
        console.log(err);
        addToLogs(err);
    });

    if (quota >= 200000) {
        const embed = new discord.EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Quota exceeded", iconURL: client.user.displayAvatarURL() })
            .setDescription("Quota exceeded, please wait untill reset (every month)")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });

        addToLogs('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
        console.log('[Discord] Quota exceeded for user : ' + interaction.member.user.username);
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

            addToLogs('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
            console.log('[Discord] Conversation not found in the database : ' + interaction.options.get('name').value);
        } else {
            await addMessage(interaction.options.get('name').value, "user", interaction.options.get('message').value.replace(/"/g, "\'").replace("\""), interaction.member.user.username).catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            messages = await getMessages(interaction.options.get('name').value, "role").catch((err) => {
                console.log(err);
                addToLogs(err);
            });

            sendConv(messages).then((res) => {
                incrementQuota(interaction.member.user.id, res.data.usage.total_tokens * 15).catch((err) => {
                    console.log(err);
                    addToLogs(err);
                });

                addMessage(interaction.options.get('name').value, "assistant", res.data.choices[0].message.content.replace(/"/g, "\'").replace("\""), "Chaise bot").catch((err) => {
                    console.log(err);
                    addToLogs(err);
                });

                const embed_user = new discord.EmbedBuilder()
                    .setColor(0xBBFAF4)
                    .setAuthor({ name: interaction.member.user.username, iconURL: "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".jpeg" })
                    .setDescription(interaction.options.get('message').value);

                const embed_bot = new discord.EmbedBuilder()
                    .setColor(0xFABBDE)
                    .setAuthor({ name: "Chaise bot", iconURL: client.user.displayAvatarURL() })
                    .setDescription(res.data.choices[0].message.content)
                    .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

                interaction.editReply({ embeds: [embed_user, embed_bot] });

                addToLogs('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
                console.log('[Discord] Added message to conversation : ' + interaction.options.get('name').value);
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}

module.exports = addmsg;