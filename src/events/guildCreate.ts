import { Events, Guild } from "discord.js";
import { connectToDb, getGuild, addGuild } from "../libs/mysql.js";

export default {
	name: Events.GuildCreate,
	async execute(guild: Guild) {
		const connection = await connectToDb();
        const guild_obj: any[] = await getGuild(connection, guild.id);

        connection.end()

        if (guild_obj[0]) {
            return;
        }

        addGuild(connection, guild.id);
	},
};