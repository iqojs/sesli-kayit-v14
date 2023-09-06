const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

  run: async (client, interaction) => {
    const message = await interaction.reply(`Pong 🏓`, { fetchReply: true });
    await message.edit({ content: `Pong 🏓 | ${message.createdTimestamp - interaction.createdTimestamp}ms` })
  },
};
