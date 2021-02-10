const { Client, Discord, MessageEmbed, Collection, WebhookClient } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const qdb = require('quick.db');
const db = new qdb.table("ayarlar");
const moment = require("moment");
const fs = require("fs");
const conf = require("./ayarlar.json");
global.conf = conf; // guildMemberAdd, userUpdate gibi etkinliklerde işimiz kolaylaşsın.

const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;
global.client = client;
fs.readdir("./Commands", (err, files) => {
    if(err) return console.error(err);
    files = files.filter(file => file.endsWith(".js"));
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(file => {
        let prop = require(`./Commands/${file}`);
        if(!prop.configuration) return;
        console.log(`${prop.configuration.name} komutu yükleniyor!`);
        if(typeof prop.onLoad === "function") prop.onLoad(client);
        commands.set(prop.configuration.name, prop);
        if(prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop));
    });
});

fs.readdir("./Events", (err, files) => {
    if(err) return console.error(err);
    files.filter(file => file.endsWith(".js")).forEach(file => {
        let prop = require(`./Events/${file}`);
        if(!prop.configuration) return;
        client.on(prop.configuration.name, prop);
    });
});

client.login(conf.token).then(console.log("Bot başarılı bir şekilde giriş yaptı.")).catch(err => console.error("Bot giriş yapamadı | Hata: " + err));

client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};
const emoji = global.emoji;

const sayiEmojiler = {
0: "<a:0:787416398493122562>",
1: "<a:1:787416398069497906>",
2: "<a:2:787416398620131349>",
3: "<a:3:787416398628257822>",
4: "<a:4:787416398187331616>",
5: "<a:5:787416398405042216>",
6: "<a:6:787416398523662387>",
7: "<a:7:787416398329544784>",
8: "<a:8:787416399084781590>",
9: "<a:9:787416398766014495>"
};

client.emojiSayi = function(sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

client.emojiler = {
  onay: "787418626776498178",
  iptal: "787416396060426240",
  cevrimici: "775403749945507850",
  rahatsizetmeyin: "775403768979914786",
  bosta: "775403770385137684",
  gorunmez: "775403746943434772",
  erkekEmoji: "♂️",
  kizEmoji: "♀️",
  gif1: "787421620360445962",
  gif2: "",
  gif3: "",
  gif4: "",
  gif5: "",
};

global.emoji = client.emoji = function(x) {
  return client.emojis.cache.get(client.emojiler[x]);
};

client.sayilariCevir = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const waitLimit = {};
client.on("message", (message) => {
      if (message.author.bot ||!message.content.startsWith(conf.prefix) || !message.channel || message.channel.type == "dm") return;
      if (waitLimit[message.author.id] && (Date.now() - waitLimit[message.author.id]) / (1000) <= conf.waitLimit) return;
      let args = message.content
        .substring(conf.prefix.length)
        .split(" ");
      let command = args[0];
      let bot = message.client;
      args = args.splice(1);
      let ayar = db.get("ayar") || {};
      let emoji = global.emoji;
      let calistirici;
      if (commands.has(command)) {
        calistirici = commands.get(command);
        if (message.member.roles.cache.has(conf.jailRolu) || (conf.teyitsizRolleri && conf.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
        calistirici.execute(bot, message, args, ayar, emoji);
      } else if (aliases.has(command)) {
        calistirici = aliases.get(command);
        if (message.member.roles.cache.has(conf.jailRolu) || (conf.teyitsizRolleri && conf.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol)))) return;
        calistirici.execute(bot, message, args, ayar, emoji);
      }
      waitLimit[message.member.id] = Date.now();
});



client.renk = {
  //"renksiz": "2F3136", // 0x36393E
  "mor": "#3c0149",
  "mavi": "#10033d",
  "turkuaz": "#00ffcb",
  "kirmizi": "#750b0c",
  "yesil": "#032221"// 00cd00 - 008b00
};

client.randomColor = function () {
  return client.renk[Object.keys(client.renk).random()];
};


client.splitEmbedWithDesc = async function(description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0])+1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i*2048, (i+1)*2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize-1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize-1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if(value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};








Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy | hh:ii:ss";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };
  
  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

client.wait = async function(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};

