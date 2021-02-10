const {MessageEmbed}= require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const conf = require('../ayarlar.json');

module.exports = async (member) => {
  let client = global.client;
  let ayarlar = db.get("ayar") || {};
  let jaildekiler = jdb.get("jail") || [];
  let tempjaildekiler = jdb.get("tempjail") || [{id: null}];
  let muteliler = jdb.get("mute") || [];
  let tempmute = jdb.get("tempmute") || [{id: null}];
  let seslimute = jdb.get("tempsmute") || [{id: null}];
  let yasakTaglilar = jdb.get("yasakTaglilar") || [];
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag)) && yasakTaglilar.some(x => x.includes(member.id))) await jdb.set('yasakTaglilar', yasakTaglilar.filter(x => !x.includes(member.id)));
  if(jaildekiler.some(x => x.includes(member.id)) || tempjaildekiler.some(x => x.id === member.id)){
    if(conf.jailRolu) member.roles.set([conf.jailRolu]).catch();
  } else if (ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
    if(conf.jailRolu) member.roles.set([conf.jailRolu]).catch();
    if (!yasakTaglilar.some(id => id.includes(member.id))) jdb.push('yasakTaglilar', `y${member.id}`);
    member.send(`**${member.guild.name}** adlı sunucumuzun yasaklı taglarından birine sahip olduğun için jaile atıldın! Tagı bıraktığın zaman jailden çıkabilirsin.`).catch();
  } else if (guvenilirlik) {
    if(conf.fakeHesapRolu) member.roles.set([conf.fakeHesapRolu]).catch();
    setTimeout(() => {
    member.roles.remove([conf.teyitsizRolleri]).catch();
  }, 1000)
    if(conf.fakeHesapLogKanali && member.guild.channels.cache.has(conf.fakeHesapLogKanali)) return member.guild.channels.cache.get(conf.teyitKanali).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({dynamic: true})).setDescription(`${member} üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için jaile atıldı!`).setTimestamp());
  } else if(conf.teyitsizRolleri) member.roles.add(conf.teyitsizRolleri).catch();
  if(tempmute.some(x => x.id === member.id) || muteliler.some(x => x.includes(member.id))) member.roles.add(conf.muteRolu).catch();
  if(seslimute.some(x => x.id === member.id) && member.voice.channel) member.voice.setMute(true).catch();
  let embed = new MessageEmbed().setColor(member.client.randomColor())
  .setDescription(`
  **${client.emoji("gif1")} • Sunucuya hoş geldin ${member}, seninle \`(${member.guild.memberCount})\` kişiyiz!**
  **${client.emoji("gif1")} • Ses kanalına girerek kayıt olabilirsin.**
  **${client.emoji("gif1")} • Hesabın Açılış Süresi: ${member.client.tarihHesapla(member.user.createdAt)}**
  **${client.emoji("gif1")} • Hesap ${guvenilirlik ? "Tehlikeli!" : "Güvenli!"}**
  `);
  if(conf.ikinciTag) member.setNickname(`${conf.ikinciTag} İsim | Yaş`).catch();
  else if(conf.tag) member.setNickname(`${conf.tag} İsim | Yaş`).catch();
  if (conf.embedImage) embed.setImage(conf.embedImage);
  member.guild.channels.cache.get(conf.teyitKanali).send(` **${client.emoji("gif1")} • Sunucuya hoş geldin ${member}, seninle \`${member.guild.memberCount}\` kişiyiz!** \n**${client.emoji("gif1")} • Ses kanalına girerek kayıt olabilirsin.** \n**${client.emoji("gif1")} • Seninle <@&787331160518164504> Rolündeki Yetkililer ilgilenecektir.** \n**${client.emoji("gif1")} • Hesabın Açılış Süresi: ${member.client.tarihHesapla(member.user.createdAt)}** \n**${client.emoji("gif1")} • Hesap ${guvenilirlik ? "Tehlikeli!" : "Güvenli!"}**`); 
}
module.exports.configuration = {
  name: "guildMemberAdd"
}
