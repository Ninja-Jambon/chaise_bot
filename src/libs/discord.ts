import { Events, Message, Collection } from "discord.js";
import { getChatResponse, MistralMessage, Models, InputPrice, OutputPrice, ReturnedValue } from "../libs/mistralai";
import { User, connectToDb, addUser, getUser, incrementQuota } from "../libs/mysql";

const data = require("../../config.json");

export async function getMessages(message: Message, channelid: string, userid: string): Promise<MistralMessage[]> {
    var discordMessages = await message.channel.messages.fetch({ limit: 7 })
    discordMessages.filter((m) => m.content && (m.author.id == message.author.id || m.author.id == process.env.BOT_ID))
    discordMessages.reverse();

    var messages: MistralMessage[] = [
        {
            role: "system",
            content: data.defaultPrompt
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
