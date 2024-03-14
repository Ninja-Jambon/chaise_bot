import { Events, Client } from "discord.js";
import { checkReset } from "../libs/quotaReset";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        setInterval(async () => {
            await checkReset();
        }, 10 * 60 * 1000);
    },
};
