const { ActivityType, Events } = require("discord.js")
const config = require("../config")
module.exports = {
	name: Events.GuildMemberAdd,
	once: true,
	execute(member) {
        member.roles.add(config.kayıtsızRol)
    }
}