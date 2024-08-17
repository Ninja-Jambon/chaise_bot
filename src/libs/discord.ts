import { Message, EmbedBuilder, WebhookClient } from "discord.js";
import { MistralMessage, Prompts } from "../libs/mistralai.js";

export function helpEmbed(iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Help :")
		.setDescription(
`
**Commands**

- \`/help\` : display this message
- \`/ask\` : make a single request to mistralAi API
- \`/quota\` : send how many credits you have left for the month
- \`/botinfo\` : send the infos about the bot
- \`/vote\` : send the top.gg vote link of the bot

**Other way to use the bot**

- You can DM the bot and it will answer you and remember the 6 previous messages
- You can also ping the bot or reply to one of its messages to ask it something

**Quota**

- You have 0.4$ of free credits each month
`
)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");

}

export function errorEmbed(error: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Error")
		.setDescription(error)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function successEmbed(message: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Success")
		.setDescription(message)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function quotaEmbed(quota: number, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Quota left")
		.setDescription(`You have ${0.4 - quota}$ left this month.`)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function qotdconfirm(qotd: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Confirmation de la QOTD")
		.setDescription(`Vous êtes sur le point d'envoyer cette question du jour : \n - "${qotd}"\nConfirmez-vous ?`)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function qotdEmbed(qotd: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle(`Question du jour | ${new Date(Date.now()).toLocaleDateString("fr-FR", {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		  })}`)
		.setDescription(qotd)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function confirmedQotd(qotd: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("QOTD envoyée")
		.setDescription(`Vous avez envoyé cette question du jour : \n - "${qotd}"`)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export function canceledQotd(qotd: string, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("QOTD annulée")
		.setDescription(`Vous n'avez pas envoyé cette question du jour : \n - "${qotd}"`)
		.setFooter({ text: "Bot by @ninja_jambon.", iconURL: iconURL})
		.setColor("#000000");
}

export async function getMessages(message: Message, channelid: string, userid: string): Promise<MistralMessage[]> {
	var discordMessages = await message.channel.messages.fetch({ limit: 7 })
	var filteredMessages = discordMessages.filter(m => m.content && (m.author.id == message.author.id || m.author.id == process.env.BOT_ID))
	filteredMessages.reverse();

	var messages: MistralMessage[] = [
		{
			role: "system",
			content: Prompts.default,
		}
	]

	filteredMessages.forEach(discordMessage => {
		messages.push({
			role: discordMessage.author.id == process.env.BOT_ID ? "assistant" : "user",
			content: discordMessage.content,
		})
	})

	return messages;
}

export function sendLog(text: string) {
	const webhook: WebhookClient = new WebhookClient({ id : process.env.WEBHOOK_ID ? process.env.WEBHOOK_ID : "", token : process.env.WEBHOOK_TOKEN ? process.env.WEBHOOK_TOKEN : "" });

	webhook.send({
		content: text,
	})
}
