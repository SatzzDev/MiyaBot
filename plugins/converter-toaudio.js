require('../config')
const { Miya } = require('../lib/command.js');
const axios = require('axios')
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")
const {ftxt, ttle} = require('../lib/scrapes')
const { exec } = require("child_process");
let { webp2mp4File } = require("../lib/uploader");

Miya({
command: '^tomp3|toaud$',
limit: true,
alias: 'toaudio',
desc: 'video to audio',
type: 'Converter'
}, async (m, {miya, command, reply, qmsg, text, mime}) => {
if (!m.quoted) return reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption .${command
}`);
let media = await miya.downloadMediaMessage(qmsg);
let { toAudio } = require("../lib/converter");
let audio = await toAudio(media, "mp4");
await miya.sendMessage(m.chat, { audio: audio, mimetype: "audio/mpeg" },{ quoted: m }); 
})