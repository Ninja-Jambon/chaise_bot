import { Events, Client } from "discord.js";
import { checkReset } from "../libs/quotaReset.js";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user?.tag}`);
		
		client.user?.setPresence({ activities: [{ name: '/ask', type: 3 }] });

		setInterval(async () => {
			await checkReset();
		}, 15 * 60 * 1000);

		setInterval(async () => {
			client.user?.setPresence({ activities: [{ name: '/ask', type: 3 }] });
		}, 10 * 60 * 1000);
	},
};
