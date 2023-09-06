const { joinVoiceChannel } = require("@discordjs/voice");
const config = require("../config.js");
const { EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");

let voiceUserMap = new Map();

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(client, oldState, newState) {
    if (!oldState.channelId && newState.channelId == config.channel) {
      try {
        const channel = await client.channels.cache.get(newState.channelId);

        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        setTimeout(async () => {
          const receiver = connection.receiver;

          newState.channel.members.forEach(async (member) => {
            const ssrc = receiver.ssrcMap;
            const voiceUser = ssrc.get(member.id);
            const { id } = await client.users.cache.get(member.id);

            if (voiceUser) {
              const subscription = receiver.subscribe(id);

              subscription.on("data", function (packet) {
                if (voiceUserMap.get(id)) return;
                handle(client, id);
              });
            }
          });
        }, 5000);
      } catch (error) {
        console.error("Ses kanalına katılamıyor:", error);
      }
    }
  },
};

async function handle(client, id) {
  voiceUserMap.set(id, true);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const user = await client.users.cache.get(id);

  user.send({
    embeds: [new EmbedBuilder().setDescription("Kayıt olmak için aşşağıdaki butona basıp formu gönderin.").setColor("Green")],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("register").setLabel("Kayıt Ol").setStyle("Success")
      ),
    ],
  });

}
