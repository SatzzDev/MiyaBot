const { Miya } = require('../lib/command.js');
const yts = require("yt-search");
const { fetchJson, getRandom, getBuffer } = require('../lib/myfunc.js')
const axios = require("axios")
const qs = require("qs")

const ytmp3 = async (url) => {
let res = await axios({url: 'https://mypyapi.up.railway.app/yt?url=' + encodeURIComponent(url), responseType: 'arraybuffer'})
return { buffer: res.data }
}

const ytmp4 = async (url) => {
let res = await axios({url: 'https://mypyapi.up.railway.app/yt?url=' + encodeURIComponent(url) + '&type=mp4', responseType: 'arraybuffer'})
return { buffer: res.data }
}

Miya({
command: '^play$',
limit: true,
desc: 'Play audio from YouTube',
type: 'Downloader'
}, async (m, { miya, command, text, reply }) => {
try {
if (!text) return reply(`Example : .${command} Patience - Take That`);
await reply(global.mess.wait);
let v = await yts(text)
const res = await ytmp3("https://youtube.com/watch?v=" + v.videos[0].videoId);
const contextInfo = {
externalAdReply: {
title: v.videos[0].title,
body: 'Y O U T U B E - P L A Y',
thumbnailUrl: v.videos[0].image,
sourceUrl: "https://youtube.com/watch?v=" + v.videos[0].videoId,
mediaUrl: "https://youtube.com/watch?v=" + v.videos[0].videoId, 
mediaType: 2,
renderLargerThumbnail: true,
}
};  
await miya.sendMessage(m.chat, { audio: res.buffer, ptt: false, mimetype: 'audio/mp4', contextInfo }, { quoted: m });
} catch (err) {
console.log(err)
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
});


Miya({
command: '^ytmp3$',
alias: 'ytmp3',
limit: true,
desc: 'to Download Audio From Youtube',
type: 'Downloader'
}, async (m, {miya, command, text, reply}) => {
try {
if (!text) return reply(`Example : .${command} https://youtube.com/watch?v=PtFMh6Tccag%27`)
if (!text.startsWith('https://')) return reply('itu bukan link kak, kalau mau nyari dan download musik make .play')
await reply(global.mess.wait)
let url = text
const res = await ytmp3(url)
miya.sendMessage(m.chat, { audio: res.buffer, ptt: false, mimetype: 'audio/mp4'}, { quoted: m });
} catch (err) {
console.log(err)
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
})

Miya({
command: '^ytmp4$',
alias: 'ytmp4',
limit: true,
desc: 'to Download Audio From Youtube',
type: 'Downloader'
}, async (m, {miya, command, text, reply}) => {
try {
if (!text) return reply(`Example : .${command} https://youtube.com/watch?v=PtFMh6Tccag%27`)
if (!text.includes('https')) return reply('itu bukan link kak, kalau mau nyari dan download musik make .play')
await reply(global.mess.wait)
const res = await ytmp4(text);  
miya.sendMessage(m.chat, { video: res.buffer, mimetype: 'video/mp4'}, { quoted: m });
} catch (err) {
console.log(err)
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
})