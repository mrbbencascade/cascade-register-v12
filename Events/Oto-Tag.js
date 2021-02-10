const discord = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const cdb = new qdb.table("cezalar");
const conf = require('../ayarlar.json');

module.exports = (oldUser, newUser) => {
  if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
  let ayarlar = db.get(`ayar`) || {};
  if(!conf.tag) return;
  let client = oldUser.client;
  let guild = client.guilds.cache.get(global.conf.sunucuId);
  if(!guild) return console.error(`${__filename} Sunucu bulunamadı!`);
  let user = guild.members.cache.get(oldUser.id);
  if(!user) return;
  const embed = new discord.MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({dynamic: true})).setColor(client.randomColor()).setTimestamp();
  let log = client.channels.cache.get(conf.ekipLogKanali);
  let yasakTaglilar = db.get('yasakTaglilar') || [];

  if ((ayarlar.yasakTaglar && ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (conf.jailRolu && !user.roles.cache.has(conf.jailRolu))) {
    user.roles.set(user.roles.cache.has(conf.boosterRolu) ? [conf.boosterRolu, conf.jailRolu] : [conf.jailRolu]).catch();
    if(user.manageable) user.setNickname(newUser.username).catch();
    user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birini kullanıcı adına aldığın için jaile atıldın! Tagı geri bıraktığında jailden çıkacaksın.`).catch();
    if(!yasakTaglilar.some(x => x.includes(newUser.id))) cdb.push('yasakTaglilar', `y${newUser.id}`);
    return;
  };
  if ((ayarlar.yasakTaglar && !ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (conf.jailRolu && user.roles.cache.has(conf.jailRolu)) && yasakTaglilar.some(x => x.includes(newUser.id))) {
    if (conf.teyitsizRolleri) user.roles.set(conf.teyitsizRolleri).catch();
    user.send(`**${user.guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için jaildeydin ve şimdi bu yasaklı tagı çıkardığın için jailden çıkarıldın!`).catch();
    if (conf.teyitKanali && client.channels.cache.has(conf.teyitKanali)) client.channels.cache.get(conf.teyitKanali).send(`\|\| ${user} \|\|`, { embed: embed.setDescription("Yasaklı tagı bıraktığın için teşekkür ederiz! Ses kanallarından birine gelerek kayıt olabilirsin.") }).catch();
    cdb.set('yasakTaglilar', yasakTaglilar.filter(x => !x.includes(newUser.id)));
    return;
  };
  
  if(newUser.username.includes(conf.tag) && !user.roles.cache.has(conf.ekipRolu)){
      if ((conf.teyitsizRolleri && conf.teyitsizRolleri.some(rol => user.roles.cache.has(rol))) || (conf.jailRolu && user.roles.cache.has(conf.jailRolu))) return;
      if(user.manageable && conf.ikinciTag) user.setNickname(user.displayName.replace(conf.ikinciTag, conf.tag)).catch();
      if(conf.ekipRolu) user.roles.add(conf.ekipRolu).catch();
      if(conf.ekipLogKanali && log) log.send(embed.setDescription(`${user} kişisi ismine \`${conf.tag}\` sembolünü alarak <@&${conf.ekipRolu}> ekibimize katıldı!`).setColor("#32FF00")).catch();
  } else if(!newUser.username.includes(conf.tag) && user.roles.cache.has(conf.ekipRolu)){
      if(user.manageable && ayarlar.ikinciTag) user.setNickname(user.displayName.replace(conf.tag, conf.ikinciTag)).catch();
      if(conf.ekipRolu){
        let ekipRol = guild.roles.cache.get(conf.ekipRolu);
        user.roles.remove(user.roles.cache.filter(rol => ekipRol.position <= rol.position)).catch();
      }
      if(conf.ekipLogKanali && log) log.send(embed.setDescription(`${user} kişisi isminden \`${conf.tag}\` sembolünü çıkararak <@&${conf.ekipRolu}> ekibimizden ayrıldı!`).setColor("#B20000")).catch();
  }
}

module.exports.configuration = {
  name: "userUpdate"
}
