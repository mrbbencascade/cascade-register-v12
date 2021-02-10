const Discord = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const ayarlar = require("../ayarlar.json")

module.exports.execute = async (client, message, args ,params) => {
let yetkili = ayarlar.teyitciRolleri
if (!message.member.roles.cache.has(yetkili) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.sendEmbed(new Discord.MessageEmbed().setDescription('Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!') .setColor("random")).then(m => m.delete(5000));
let kullanıcı = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
let isimler;
const eski = await db.fetch(`isim_${kullanıcı.id}_${message.guild.id}`);
if (!eski) {

const aresMesaj = new Discord.MessageEmbed()
.setDescription(`${kullanıcı} Kullanıcısının isim kaydı bulunmuyor!`)
.setColor("BLUE")
message.channel.send(aresMesaj);
}
if (eski)
{
        const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setDescription(`Bu kullanıcı önceden aşağıdaki isimler ile de kayıt olmuş:  \n\n${eski.join("\n") || "Teyit veritabanı bulunamadı!"}\n Tüm isim geçmişine \`${ayarlar.prefix}isimler @cascade\` ile bakmanız önerilir.`)
    .setColor("BLUE")
    message.channel.send(embed);
      }
    };
     
    module.exports.configuration = {
        name: "isimler",
        aliases: ["names", "nicks"],
        usage: "isimler",
        description: "Belirtilen üyenin daha önceki isimlerini gösterir"
      };
