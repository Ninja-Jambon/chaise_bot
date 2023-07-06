const { EmbedBuilder } = require('discord.js');

function help(interaction, client) {
    const embed = new EmbedBuilder()
        .setColor(0xFABBDE)
        .setAuthor({ name: "Help", iconURL: client.user.displayAvatarURL() })
        .setDescription(`
        **OpenAI basic commands :**
            \`/gptrequest [query]\` : Make a request to the GPT-4 API
            \`/quickgpt [query]\` : Make a request to the GPT-3.5-turbo API
            \`/dalle [query]\` : Make a request to the DALL-E API

        **OpenAI conversations commands :**
            *Note : These commands allow you to create conversations and add messages to them, so that the bot will remember your previous messages*

            \`/addconv [convName]\` : Add a conversation to the database
            \`/delconv [convName]\` : Delete a conversation from the database
            \`/listconvs\` : List all the conversations in the database
            \`/displayconv [convName]\` : Display a conversation from the database
            \`/addmsg [message]\` : Add a message to the conversation

        **Channel commands :**
            *Note : These commands allow you to talk to the bots without using any commands in a specific channel (this requires admin permission)*

            \`/addchannel [channelName]\` : Add a channel to the database
            \`/delchannel [channelName]\` : Delete a channel from the database

        **Miscellaneous commands :**
            \`/github\` : Get the github link of the bot
            \`/getmyquota\` : Get your quota *Note : Since the OpenAI API is not free, all users have a quota of 200k tokens*
            \`/help\` : Display this message
        `)
        .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

    interaction.reply({ embeds: [embed] });
}

module.exports = help;