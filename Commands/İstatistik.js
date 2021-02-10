const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const mdb = new qdb.table("level");
const sdb = new qdb.table("istatistik");
const kdb = new qdb.table("kullanici");
const conf = require("../ayarlar.json");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  
  let guild = message.guild;
  let yetkiliBilgisi = ``;
  if((conf.sahipRolu && uye.roles.cache.has(conf.sahipRolu)) || (conf.teyitciRolleri && conf.teyitciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let teyit = kdb.get(`teyit.${uye.id}`) || undefined;
    if(teyit){
      let erkekTeyit = teyit.erkek || 0;
      let kizTeyit = teyit.kiz || 0;
      yetkiliBilgisi += `\`Teyitleri:\` ${erkekTeyit+kizTeyit} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
    }
  };
  if((conf.sahipRolu && uye.roles.cache.has(conf.sahipRolu)) || (conf.muteciRolleri && conf.muteciRolleri.some(rol => uye.roles.cache.has(rol))) || (conf.banciRolleri && conf.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (conf.banciRolleri && conf.banciRolleri.some(rol => uye.roles.cache.has(rol))) || (conf.jailciRolleri && conf.jailciRolleri.some(rol => uye.roles.cache.has(rol)))) {
    let uyari = kdb.get(`kullanici.${uye.id}.uyari`) || 0;
    let chatMute = kdb.get(`kullanici.${uye.id}.mute`) || 0;
    let sesMute = kdb.get(`kullanici.${uye.id}.sesmute`) || 0;
    let kick = kdb.get(`kullanici.${uye.id}.kick`) || 0;
    let ban = kdb.get(`kullanici.${uye.id}.ban`) || 0;
    let jail = kdb.get(`kullanici.${uye.id}.jail`) || 0;
  };
  let victim = kullanici;
  const embed = new MessageEmbed().setTimestamp().setColor(client.randomColor()).setFooter(message.guild.name, message.guild.iconURL({dynamic: true, size: 2048})).setAuthor(kullanici.tag.replace("`", ""), kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}))
  .addField(`__**Kullanıcı Bilgisi**__`, `\`ID:\` ${kullanici.id}\n\`Profil:\` ${kullanici}`)
  .addField(`__**Üyelik Bilgisi**__`, `\`Takma Adı:\` ${uye.displayName.replace("`", "")} ${uye.nickname ? "" : "[Yok]"}\n${yetkiliBilgisi}`);  
 message.channel.send(embed)
};
module.exports.configuration = {
    name: "teyitbilgi",
    aliases: ["tbilgi", "ti", "tme", "tuser", "tinfo"],
    usage: "istatistik [üye]",
    description: "Belirtilen üyenin teyit bilgilerini gösterir."
};

function changeIndex(x){
  switch(x){
    case 1:
      return "1.";
    case 2:
      return "2.";
    case 3:
      return "3.";
    default:
      return `${x}.`;
  }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
