import { Events, Message, Collection } from "discord.js";
import { getChatResponse, MistralMessage, Models, InputPrice, OutputPrice, ReturnedValue, Prompts } from "../libs/mistralai.js";
import { User, connectToDb, addUser, getUser, incrementQuota } from "../libs/mysql.js";

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
