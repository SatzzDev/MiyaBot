const fs = require('fs');
const { Miya, commands, Handler } = require('../lib/command.js');
const { runtime, getBuffer, } = require('../lib/myfunc.js');
const stringSimilarity = require('string-similarity');

Miya({
command: '^menu$',
}, async (m, { miya, isOwner, command, isPremium, text }) => {
const PREFIX = /^[.,!]/;
const commandsList = {};
commands.forEach(cmd => {
if (cmd.dontAddCommandList === false && cmd.command) {
try {
const match = cmd.command.toString().match(/(\W*)([\w\s\d]*)/);
const commandName = match ? match[2].trim() : '';
const handler = PREFIX.source.charAt(1) || '.';
if (commandName) {
if (!commandsList[cmd.type]) commandsList[cmd.type] = [];
commandsList[cmd.type].push(handler + commandName);
}
} catch (error) {
console.error('Error processing command:', error);
}
}
});

if (!text) {
let rows = []
let sections = [{title:"List Menu", rows}];
for (const category in commandsList) {
if (category !== 'misc') {
rows.push({title: category, description: `Lihat semua perintah dalam kategori ${category}`, id: `.menu ${category}`})
}
}
await miya.sendMessage(m.chat,
{text:"*`[ M I Y A - B O T ]`*\n" + `*– 乂 Info User*
> *- Nama :* ${m.pushName}
> *- Tag :* @${m.sender.split("@")[0]}
> *- Status :* ${isOwner ? "👨‍💻 Developer" : isPremium ? "Premium 🅥" : "Gratisan"}
> *- Limit :* ${isPremium ? "∞" : db.data.users[m.sender].limit}

*– 乂 Info - Bot*
> *- Nama :* ${global.botname}
> *- Versi :* v9.0.0
> *- Runtime :* ${runtime(process.uptime())}
> *- Prefix :* [ . ]
> *- Total fitur :* ${commands.length}
> *- Source code :* -
`,
footer: global.footer, 
mentions: [m.sender],
buttons:[
{ buttonId: 'interactive', buttonText: { displayText: 'Click Here' }, nativeFlowInfo:{ name:'single_select', paramsJson: JSON.stringify({ title: 'MiyaBot Features', sections})}, type: 2 },
{buttonId: '.owner', buttonText: {displayText: 'Owner'}, type: 1},
{buttonId: '.speed', buttonText: {displayText: 'Speedtest'}, type: 1}
],
viewOnce:true
},{quoted:global.fake})
await miya.sendMessage(m.chat, {audio:{url:'https://files.catbox.moe/5agcbt.webm'}, ptt:true, mimetype:'audio/mp4', waveform: new Uint8Array(64)})
} else {
if (!commandsList[text]) return m.reply(`Kategori *${text}* tidak ditemukan.`);
let bodyText = `┌── *「 ${text.toUpperCase()} 」*\n`;
commandsList[text].forEach(cmd => {
bodyText += `│ ⇒ ${cmd.replace(/[":]/g, '').split('[')[1]}\n`;
});
bodyText += '└──────────────\n';
await miya.sendMessage(m.chat,
{text: bodyText,
footer: global.footer, 
buttons: [
{ buttonId: 'action', buttonText: { displayText:'WhatsApp Group'}, nativeFlowInfo: { name: 'cta_url', paramsJson: JSON.stringify({ display_text: 'WhatsApp Group', url: 'whatsapp://chat?code=H0ho9w6jsekAx2EYsh4yf5', merchant_url: 'whatsapp://chat?code=H0ho9w6jsekAx2EYsh4yf5' })}, type: 2 },
{ buttonId: 'action', buttonText: { displayText:'Channel'}, nativeFlowInfo: { name: 'cta_url', paramsJson: JSON.stringify({ display_text: 'Channel', url: 'whatsapp://channel/0029VaMQ48rBPzjapT1Ukk30', merchant_url: 'whatsapp://channel/0029VaMQ48rBPzjapT1Ukk30' })}, type: 2 },
{ buttonId: '.menu', buttonText: { displayText: 'Main Menu' }, type: 1 },
],
viewOnce:true},{quoted:global.fake});
}
})