const {
  Events,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { addConv, removeConv, getConv } = require("../libs/mysql.js");
const {
  errorEmbed,
  convBeginEmbed,
  convCreatedEmbed,
} = require("../libs/embeds.js");
const { sendLog } = require("../libs/logs.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        sendLog(error);
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId == "create_conversation") {
        var channel = interaction.guild.channels.cache.get(
          interaction.message.channelId
        );

        if (channel.type == 11) {
          channel = interaction.guild.channels.cache.get(channel.parentId);
        }

        const embed = convBeginEmbed();

        const button = new ButtonBuilder()
          .setCustomId("close_conversation")
          .setLabel("Close conversation")
          .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder().addComponents(button);

        channel = await channel.threads
          .create({
            name: interaction.user.username + "'s conversation",
            message: {
              embeds: [embed],
              components: [actionRow],
            },
          })
          .catch((err) => {
            sendLog(err);
          });

        const embed2 = convCreatedEmbed(channel.id);

        await addConv(
          interaction.user.id,
          channel.id,
          interaction.guild.id
        ).catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while creating the conversation."
          );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        });

        await interaction.reply({ embeds: [embed2], ephemeral: true });
      } else if (interaction.customId == "close_conversation") {
        const conv = await getConv(interaction.message.channelId).catch(
          (err) => {
            sendLog(err);
            const embed = errorEmbed(
              "An error occured while closing the conversation."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
        );

        if (conv[0].userid != interaction.user.id) {
          const embed = errorEmbed("You can't close this conversation.");

          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        var channel = interaction.guild.channels.cache.get(
          interaction.message.channelId
        );

        await removeConv(channel.id).catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while closing the conversation."
          );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        });

        await channel.delete().catch((err) => {
          sendLog(err);
          const embed = errorEmbed(
            "An error occured while closing the conversation."
          );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        });
      }
    }
  },
};
