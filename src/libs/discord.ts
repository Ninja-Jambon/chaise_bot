import { Events, Message, Collection, EmbedBuilder, WebhookClient } from "discord.js";
import { getChatResponse, MistralMessage, Models, InputPrice, OutputPrice, ReturnedValue, Prompts } from "../libs/mistralai.js";
import { User, connectToDb, addUser, getUser, incrementQuota } from "../libs/mysql.js";

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
		.setFooter({ text: "Bot by @ninja_jambon."})
		.setColor("#000000");
}

export function quotaEmbed(quota: number, iconURL: string) {
	return new EmbedBuilder()
		.setTitle("Quota left")
		.setDescription(`You have ${0.4 - quota}$ left this month.`)
		.setFooter({ text: "Bot by @ninja_jambon."})
		.setColor("#000000");
}
 
export async function getMessages(message: Message, channelid: string, userid: string): Promise<MistralMessage[]> {
	var discordMessages = await message.channel.messages.fetch({ limit: 7 })
	discordMessages.filter((m) => m.content && (m.author.id == message.author.id || m.author.id == process.env.BOT_ID))
	discordMessages.reverse();

	var messages: MistralMessage[] = [
		{
			role: "system",
			content: Prompts.default,
		}
	]

	discordMessages.forEach(discordMessage => {
		messages.push({
			role: discordMessage.author.id == process.env.BOT_ID ? "assistant" : "user",
			content: discordMessage.content,
		})
	})

	return messages;
}

export function sendLog(text: string) {
	const webhook: WebhookClient = new WebhookClient({ id : '1187067107054202961', token : 'M7bsyOwFPMXQTMB8tvrWZu-gLT9rSjl1NASOBrz-z4lwvbwQ9To_yAywE_4aj5oGBP0D' });

	webhook.send({
		content: text,
	})
}
