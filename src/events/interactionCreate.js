const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const isimler = require("../database/names.json");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (client, interaction) => {
    if (interaction.isButton()) return await ButtonHandle(client, interaction);
    if (interaction.isModalSubmit()) return await ModalHandle(client, interaction);

    if (!interaction.isChatInputCommand()) return;
    if (interaction.user.bot) return;
    try {
      const command = client.commands.get(interaction.commandName);
      command.run(client, interaction);
    } catch (e) {
      console.error(e);
      interaction.reply({
        content:
          "Komut çalıştırılırken bir sorunla karşılaşıldı! Lütfen tekrar deneyin.",
        ephemeral: true,
      });
    }
  },
};

async function ButtonHandle(client, interaction) {
  if (interaction.customId === "register") return;

  const modal = new ModalBuilder()
    .setTitle("Kayıt Formu")
    .setCustomId("register_modal");

  const name = TextInputBuilder()
    .setPlaceholder("İsminizi giriniz.")
    .setMinLength(2)
    .setMaxLength(32)
    .setStyle(TextInputStyle.Short)
    .setCustomId("name")
    .setRequired(true);

  const age = TextInputBuilder()
    .setPlaceholder("Yaşınızı giriniz.")
    .setMinLength(1)
    .setMaxLength(2)
    .setStyle(TextInputStyle.Short)
    .setCustomId("age")
    .setRequired(true);

  const firstActionRow = new ActionRowBuilder().addComponents(name);
  const secondActionRow = new ActionRowBuilder().addComponents(age);

  modal.addComponents(firstActionRow, secondActionRow);

  await interaction.showModal(modal);
}

async function ModalHandle(client, interaction) {
  const name = interaction.fields.getTextInputValue("name");
  let age = interaction.fields.getTextInputValue("age");

  const findedName = findName(name);

  if (!findedName) {
    return await interaction.reply({
      content: "Lütfen geçerli bir isim girin.",
      ephemeral: true,
    });
  }

  if (isNaN(Number(age))) {
    return await interaction.reply({
      content: "Lütfen geçerli bir yaş girin.",
      ephemeral: true,
    });
  }

  age = Number(age);

  if (age < 11) {
    return await interaction.reply({
      content: "11 yaşından küçükler kayıt olamaz.",
      ephemeral: true,
    });
  }

  if (age > 50) {
    return await interaction.reply({
      content: "Sence çok yaşlı değil misin?",
      ephemeral: true,
    });
  }

  const server = await client.guilds.cache.get(config.guildId);
  const member = await server.members.cache.get(interaction.user.id);

  await interaction.editReply({
    content: "Kayıt formu başarıyla gönderildi.",
    components: [],
    embeds: []
  });
  await member.roles.remove(config.kayıtsızRol);
  await member.roles.add(findedName.b === "E" ? config.erkekRol : config.kızRol);
  await member.setNickname(`${findedName.a} | ${age}`);
  
}

function findName(name) {
  return isimler.find((x) => x.a === name);
}
