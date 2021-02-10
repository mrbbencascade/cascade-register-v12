const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const conf = require("../ayarlar.json");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed()
  .setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
  .setColor(client.randomColor())
  .setTimestamp();
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!")).then(x => x.delete({timeout: 5000}));
  function ortalama(array) {
    if(array.length <= 0) return 0;
    const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
    return average(array).toFixed();
  };
  if (!conf.erkekRolleri || !conf.kizRolleri || !conf.ekipRolu) return message.channel.send(embed.setDescription("**Roller ayarlanmamış!**"));
  let members = message.guild.members.cache;
  let genel = members.filter(member => member.nickname && member.nickname.includes('|') && !isNaN(member.nickname.split('| ')[1])).map(member => Number(member.nickname.split('| ')[1]));
  let erkek = members.filter(member => conf.erkekRolleri.some(rol => member.roles.cache.has(rol)) && member.nickname && member.nickname.includes('|') && !isNaN(member.nickname.split('| ')[1] || "")).map(member => Number(member.nickname.split('| ')[1]));
  let kiz = members.filter(member => conf.kizRolleri.some(rol => member.roles.cache.has(rol)) && member.nickname && member.nickname.includes('|') && !isNaN(member.nickname.split('| ')[1] || "")).map(member => Number(member.nickname.split('| ')[1]));
  let tagli = members.filter(member => member.roles.cache.has(conf.ekipRolu) && member.nickname && member.nickname.includes('|') && !isNaN(member.nickname.split('| ')[1] || "")).map(member => Number(member.nickname.split('| ')[1]));
  let ses = members.filter(member => member.voice.channel && member.nickname && member.nickname.includes('|') && !isNaN(member.nickname.split('| ')[1] || "")).map(member => Number(member.nickname.split('| ')[1]));
  message.channel.send(embed.setDescription(`**Not:** Bu bilgiler manuel olarak ayarlanmamaktadır. Bot tarafından, sunucuda kayıtlı olan üyelerin yaş ortalamaları alınarak gösterilmektedir.`).addField('Anlık Sunucu Yaş Ortalamaları',
  `\`Genel:\` **${ortalama(genel)}**\n\`Erkek:\` **${ortalama(erkek)}**\n\`Kız:\` **${ortalama(kiz)}**\n\`Ekip:\` **${ortalama(tagli)}**\n\`Ses:\` **${ortalama(ses)}**`)
.setThumbnail(message.guild.iconURL({dynamic: true, size: 2048})));
};
module.exports.configuration = {
    name: "yaş-ortalaması",
    aliases: ["yaşortalaması", "yas-ortalamasi", "yasortalamasi"],
    usage: "yaş-ortalaması",
    description: "Sunucunun yaş ortalamasını gösterir."
};
