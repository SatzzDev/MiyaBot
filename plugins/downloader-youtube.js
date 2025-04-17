const { Miya } = require('../lib/command.js');
const yts = require("yt-search");
const { fetchJson, getRandom, getBuffer } = require('../lib/myfunc.js')
const axios = require("axios")
const qs = require("qs")

const searchVideo = async (url) => {
let { data } = await axios.post("https://ssvid.net/api/ajax/search", qs.stringify({ query: url, vt: "home" }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ytmp3 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp3.mp3128.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ytmp4 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp4.auto.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
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
await miya.sendMessage(m.chat, { audio: await getBuffer(res.dlink), ptt: false, mimetype: 'audio/mp4', contextInfo }, { quoted: m });
} catch (err) {
console.log(err)
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
});


Miya({
command: 'ytmp3|ytaudio',
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
const {dlink} = await ytmp3(url)
miya.sendMessage(m.chat, { audio: await getBuffer(dlink), ptt: false, mimetype: 'audio/mp4'}, { quoted: m });
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
})

Miya({
command: 'ytmp4|ytvideo',
alias: 'ytmp4',
limit: true,
desc: 'to Download Audio From Youtube',
type: 'Downloader'
}, async (m, {miya, command, text, reply}) => {
try {
if (!text) return reply(`Example : .${command} https://youtube.com/watch?v=PtFMh6Tccag%27`)
if (!text.includes('https')) return reply('itu bukan link kak, kalau mau nyari dan download musik make .play')
await reply(global.mess.wait)
const {dlink} = await ytmp4(text);  
miya.sendMessage(m.chat, { video: await getBuffer(dlink), mimetype: 'video/mp4'}, { quoted: m });
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
})