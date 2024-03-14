import { Events, Message } from "discord.js";
import { getChatResponse, MistralMessage, Models, InputPrice, OutputPrice, ReturnedValue } from "../libs/mistralai";
import { User, connectToDb, addUser, getUser, incrementQuota } from "../libs/mysql";
import { getMessages } from "../libs/discord";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (!message.guildId && message.author.id != process.env.BOT_ID) {
            const prompt: string = message.content;

            if (message.author.id != '372437660167438337') {
                return message.reply("you are not allowed to use this command");
            }

            const connection = await connectToDb();

            var user: User[] = await getUser(connection, message.author.id);

            if (!user[0]) {
                await addUser(connection, message.author.username, message.author.id);
                user = await getUser(connection, message.author.id);
            }

            if (user[0].quota > 0.4) {
                message.reply("You have exceed your quota.")
                connection.end();
                return;
            }

            const messages: MistralMessage[] = await getMessages(message, message.channelId, message.author.id);

            await message.channel.sendTyping();

            const response: ReturnedValue = await getChatResponse(messages, Models.multi_tiny);

            await incrementQuota(connection, message.author.id, InputPrice.multi_tiny * response.promptUsage + OutputPrice.multi_tiny * response.responseUsage);
            connection.end();

            message.reply(response.message);
        }
    },
};
