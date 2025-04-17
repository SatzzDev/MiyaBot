const { Miya } = require('../lib/command.js');
const axios = require('axios')
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")
const { exec } = require("child_process");
let { webp2mp4File } = require("../lib/uploader");

Miya({
command: '^(swm|wm)$',
limit: true,
desc: 'sticker with custom watermark',
type: 'Stiker'
}, async (m, {miya, command, reply, qmsg, mime}) => {
const {q} = m
if (!q) return reply('input packname|author')
//if (!/webp/.test(mime)) return m.reply(`Reply sticker dengan caption *.${command}*`);
try {
let { webp2mp4File } = require("../lib/uploader");
let medias = await miya.downloadAndSaveMediaMessage(qmsg);
let ran = await webp2mp4File(medias);
miya.sendVideoAsSticker(m.chat, ran.result, m, {
packname: q.split('|')[0],
author: q.split('|')[1],
});
} catch {
let media = await miya.downloadAndSaveMediaMessage(qmsg);
let ran = await getRandom(".png");
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
let buffer = fs.readFileSync(ran);
miya.sendImageAsSticker(m.chat, buffer, m, {
packname: q.split('|')[0],
author: q.split('|')[1],
});
});
}
})