const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const conf = require('../ayarlar.json');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("Cascade").setColor(client.randomColor()).setTimestamp();
  if(!conf.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(conf.sahipRolu)) return message.channel.send(embed.setDescription(`Kayıtsız komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if(conf.ikinciTag) member.setNickname(`${conf.ikinciTag} İsim | Yaş`).catch();
  else if(conf.tag) member.setNickname(`${conf.tag} İsim | Yaş`).catch();
  await uye.roles.set(conf.teyitsizRolleri || []).catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından kayıtsıza atıldı!`)).catch();
};
module.exports.configuration = {
  name: "kayıtsız",
  aliases: [],
  usage: "kayıtsız [üye]",
  description: "Belirtilen üyeyi kayıtsıza atar."
};
