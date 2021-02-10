const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const conf = require('../ayarlar.json');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  
  let embed = new MessageEmbed()
  .setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
  .setColor(client.randomColor())
  .setTimestamp();
  
  if((!conf.erkekRolleri && !conf.kizRolleri) || !conf.teyitciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!conf.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(conf.sahipRolu) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Kayıt komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  
  
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  args = args.filter(a => a !== "" && a !== " ").splice(1);
  let yazilacakIsim;
  if (conf["isim-yas"]) {
    
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(embed.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(conf.tag) ? conf.tag : (conf.ikinciTag ? conf.ikinciTag : (conf.tag || ""))} ${isim} | ${yaş}`;
  } else {
        let isim = args.join(' ');
    if(!isim) return message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(conf.tag) ? conf.tag : (conf.ikinciTag ? conf.ikinciTag : (conf.tag || ""))} ${isim}`;
  };
  
      if (conf.teyitsizRolleri && conf.teyitsizRolleri.some(rol => uye.roles.cache.has(rol))) kdb.add(`teyit.${message.author.id}.kiz`, 1);
  
      await uye.roles.add(conf.kizRolleri || []).catch();
      setTimeout(() => {
        uye.roles.remove(conf.teyitsizRolleri || []).catch();
      }, 500)
      setTimeout(() => {
      uye.roles.remove(conf.erkekRolleri || []).catch();
    }, 1000)
    setTimeout(() => {
    uye.setNickname(`${yazilacakIsim}`).catch();
  }, 1200)
   message.react('✅');
   setTimeout(() => {
   db.push(`isim_${uye.id}_${message.guild.id}`, yazilacakIsim);
  }, 1200)
  
    if(conf.tag && uye.user.username.includes(conf.tag)) uye.roles.add(conf.ekipRolu).catch();
    const eski = await db.fetch(`isim_${uye.user.id}_${message.guild.id}`);
    if (!eski) {
    message.channel.send(embed.setDescription(`<@${uye.user.id}> başarıyla <@&787331148844892200> olarak kayıt edildi`)).then(x => x.delete({timeout: 15000}));
  }
  if (eski) {
    message.channel.send(embed.setDescription(`<@${uye.user.id}> başarıyla <@&787331148844892200> olarak kayıt edildi \n Bu kişi Daha önce Şu isimlerle kayıt oldu: \n${eski.join("\n") || "Daha önce kayıt olmamış!"}`)).then(x => x.delete({timeout: 15000}));
  }
}  ;
module.exports.configuration = {
  name: "kız",
  aliases: ["kız", "k", "woman", "girl"],
  usage: "kız [üye] [isim] [yaş]",
  description: "Belirtilen üyeyi kız olarak kaydeder."
};
