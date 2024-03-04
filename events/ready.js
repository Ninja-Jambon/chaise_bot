const { Events } = require("discord.js");
const { sendLog } = require("../libs/logs.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
	sendLog(`Ready! Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: client.guilds.cache.size + " servers !", type: 3 }],
    });

    setInterval(() => {
      client.user.setPresence({
        activities: [
          { name: client.guilds.cache.size + " servers !", type: 3 },
        ],
      });
    }, 10000);
  },
};
