import { Events, Client } from "discord.js";
import { checkReset } from "../libs/quotaReset.js";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {
		console.log(`Ready! Logged in as ${client.user?.tag}`);
		
		client.user?.setPresence({ activities: [{ name: '/ask | Bot fixed !', type: 3 }] });

		setInterval(async () => {
			await checkReset();
		}, 1000 * 60);

		setInterval(async () => {
			client.user?.setPresence({ activities: [{ name: '/ask | Bot fixed !', type: 3 }] });
		}, 10 * 60 * 1000);
	},
};
