import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getQotd, MistralMessage, Models, ReturnedValue, Prompts } from "../../libs/mistralai.js";
import { qotdEmbed, qotdconfirm, confirmedQotd, canceledQotd, errorEmbed } from "../../libs/discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("qotd")
		.setDescription("Send the question of the day.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("theme").setDescription("Set the theme of the question").setRequired(false)
        )
        .addRoleOption(option =>
            option.setName("role").setDescription("Set the role to ping").setRequired(false)
        ),
	async execute(interaction: ChatInputCommandInteraction) {
        const theme = interaction.options.getString("theme");
        const role = interaction.options.getRole("role");

        // @ts-ignore: Unreachable code error
        if (!interaction.member?.roles.cache.find(r => r.id == "1183531599808184361" || r.id == "1168920882262061167" || r.id == "1153785890078994524" )) {
            return interaction.reply({embeds: [errorEmbed("You are not allowed to use that command", interaction.client.user.displayAvatarURL())], ephemeral: true});
        }

        const messages: MistralMessage[] = [
            {
                role: "system",
                content: Prompts.qotd,
            },
            {
                role: "user",
                content: theme ? `thème: ${theme}` : "thème de ton choix"
            }
        ]

        const response: ReturnedValue = await getQotd(messages, Models.multi_tiny);
        const qotd = JSON.parse(response.message).qotd

        const confirm_embed = qotdconfirm(qotd, interaction.client.user.displayAvatarURL())

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirmer')
			.setStyle(ButtonStyle.Success);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Annuler')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		// @ts-ignore: Unreachable code error
        const reply = await interaction.reply({embeds: [confirm_embed], components: [row], ephemeral: true});

	    const confirmation = await reply.awaitMessageComponent({ time: 60_000 });

        if (confirmation.customId === 'confirm') {
            await confirmation.reply({embeds: [confirmedQotd(qotd, interaction.client.user.displayAvatarURL())], ephemeral: true})
            await interaction.channel?.send({content: role ? `<@&${role.id}>` : '', embeds: [qotdEmbed(qotd, interaction.client.user.displayAvatarURL())]})
        } else if (confirmation.customId === 'cancel') {
            await confirmation.reply({embeds: [canceledQotd(qotd, interaction.client.user.displayAvatarURL())], ephemeral: true})
        }
	},
};
