const { ActivityType, Events } = require("discord.js")
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

    client.user.setActivity({ name: `Raven <3`, type: ActivityType.Listening })
}};
