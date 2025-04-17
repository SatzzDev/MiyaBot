const fs = require('fs');
const chalk = require('chalk');
const util = require('util');
const fetch = require("node-fetch")
const { reSize, getBuffer } = require('./myfunc');
//const knights = require("@lyncx/canvas");
const { Welcome, Goodbye } = require("./canvas")




exports.memberUpdate = async (miya, anu) => {
try {
const metadata = await miya.groupMetadata(anu.id);
const { subject: groupName = '', desc: groupDesc = '', participants: groupParticipants } = metadata;
const participantCount = groupParticipants.length;
const defaultImage = 'https://i.pinimg.com/originals/59/fe/0a/59fe0ad8cdbe4314797b29e8f033384c.jpg';
//const groupIconUrl = await miya.profilePictureUrl(anu.id, 'image').catch(() => defaultImage);
await Promise.all(
anu.participants.map(async (num) => {
const avt = await miya.profilePictureUrl(num, 'image').catch(() => defaultImage);
const avatar = await (await fetch(avt)).buffer()
const username = await miya.getName(num);
const welcomeMessage = `Welcome, *@${num.split("@")[0]}* 💐, Please Read:\n${groupDesc}`;
const goodbyeMessage = `Goodbye, *@${num.split("@")[0]}* 💐`;
const sections = [{
title:"List Menu", 
rows:[
{title: 'BRAT STICKER', description: `perintah untuk membuat sticker brat.`, id: '.hd'},
{title: 'STICKER', description: `perintah untuk membuat gambar menjadi sticker.`, id: '.hd'},
{title: 'HD', description: `perintah untuk mengubah gambar menjadi hd/image upscaler.`, id: '.hd'},
{title: 'REMOVE BACKGROUND', description: `perintah untuk mengubah gambar menjadi hd/image upscaler.`, id: '.removebg'},
{title: 'PLAY', description: `perintah untuk mencari mengirim audio dari youtube.`, id: '.play'},
{title: 'PINTEREST', description: `perintah untuk mencari mengirim gambar dari pinterest.`, id: '.hd'},
]
}]
let imageBuffer;

switch (anu.action) {
case 'add': {
miya.sendMessage(anu.id, {
image: await Welcome(username, avatar, groupName),
caption: welcomeMessage,
buttons: [
{ buttonId: `s`, buttonText: { displayText: "🔥 MUF" }, nativeFlowInfo:{ name:'single_select', paramsJson: JSON.stringify({ title: 'Most Used Features 🔥', sections})}, type: 2 },
{ buttonId: `Welcome!`, buttonText: { displayText: "Selamat Datang!" } }
],
contextInfo: {
mentionedJid: [num],
},
viewOnce: true,
});
break;
}
case 'remove': {
await miya.sendMessage(anu.id, {
image: await Goodbye(username, avatar, groupName),
caption: goodbyeMessage,
buttons: [
{ buttonId: `s`, buttonText: { displayText: "🔥 MUF" }, nativeFlowInfo:{ name:'single_select', paramsJson: JSON.stringify({ title: 'Most Used Features 🔥', sections})}, type: 2 },
{ buttonId: `Dadah 👋`, buttonText: { displayText: "Dadah 👋" } }
],
contextInfo: {
mentionedJid: [num],
},
viewOnce: true,
});
break;
}
default:
break;
}
})
);
} catch (error) {
console.error(chalk.redBright('[ERROR]'), util.format(error));
}
};
