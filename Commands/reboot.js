const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!")).then(x => x.delete({timeout: 5000}));
message.delete();
message.channel.send(new MessageEmbed().setColor('RANDOM').setTitle('Reboot;').setDescription('Eğer Kabul Ediyorsan => `onay` <=').setFooter('15 Saniye İçinde İptal!', client.user.avatarURL).setTimestamp())
.then(() => {
message.channel.awaitMessages(response => response.content === 'onay', {
max: 1,
time: 15000,
errors: ['time'],
})
.then((collected) => {
  message.channel.send(new MessageEmbed().setColor('RANDOM').setTitle('Reboot;').setDescription('Onay Verildi! Yeniden Başlatılıyorum...').setFooter('TheRenk', client.user.avatarURL).setTimestamp()).then(msg => {
console.log(`BOT : Yeniden Başlatılıyor...`);
process.exit(0);
})
})
.catch(() => {
  message.channel.send(new MessageEmbed().setColor('RANDOM').setTitle('Yeniden Başlatma;').setDescription('Komut İptal Edildi!').setFooter('TheRenk', client.user.avatarURL).setTimestamp())
});
});
};

module.exports.configuration = {
    name: "reboot",
    aliases: ["reboot", 'yenidenbaslat'],
    usage: "reboot",
    description: "botu yeniden başlatır."
};
