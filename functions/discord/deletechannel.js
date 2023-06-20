const { listchannels, deleteChannel } = require('../../libs/mysql');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

async function delechannel(interaction, client) {
    await interaction.deferReply();

    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) { 
        const embed = new EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("You must be an administrator to use this command.")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
        return;
    }

    channels = await listchannels();

    id = interaction.options.get('channel').value;

    if (channels.includes(id)) {
        deleteChannel(id);

        const embed = new EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Channel deleted", iconURL: client.user.displayAvatarURL() })
            .setDescription("Channel " + id + " deleted from db")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
    } else {
        const embed = new EmbedBuilder()
            .setColor(0xFABBDE)
            .setAuthor({ name: "Error", iconURL: client.user.displayAvatarURL() })
            .setDescription("Channel " + id + " does not exist in the database.")
            .setFooter({ text: "Powered by OpenAI https://www.openai.com/", iconURL: "https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png" });

        interaction.editReply({ embeds: [embed] });
    }
}

module.exports = delechannel;