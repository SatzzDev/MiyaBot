const { ftxt, ttle } = require('../lib/scrapes')
const { fetchJson } = require("../lib/myfunc")
const { Handler } = require('../lib/command')
const axios = require('axios');
const cheerio = require('cheerio')
const util = require("util")


Handler(async (m, { miya, user, budy, isPremium, react, mime, qmsg, reply, freply }) => {
if (m.chat !== "120363345101407384@g.us") {
if (budy.startsWith("https://") && budy.includes("instagram.com")) {
if (!isPremium && db.data.users[m.sender].limit < 1) return reply(global.mess.limit);
reply('*Instagram URL Detected!*\n\n_Downloading..._');
try {
const res = await fetchJson(`https://kaiz-apis.gleeze.com/api/insta-dl?url=${m.text}`);
miya.sendFileUrl(m.chat, res.download_url, res.title, m);
if (!isPremium) db.data.users[m.sender].limit -= 5;
} catch { m.reply("> ❌ Terjadi kesalahan, coba lagi nanti."); }
} else if (budy.startsWith("https://") && budy.includes("x.com")) {
reply('*X URL Detected*\n\n_Downloading..._');
let data = await vxtwitter(m.text)
for (let i of data.downloads) {
await miya.sendFileUrl(m.chat, i.url, "", m);
}
db.data.users[m.sender].limit -= 1
} else if (budy.startsWith("https://") && budy.includes("facebook")) {
reply('*Facebook URL Detected*\n\n_Downloading..._');
try {
let json = await fetchJson("https://kaiz-apis.gleeze.com/api/fbdl-v2?url="+m.text)
await miya.sendMessage(m.chat, {video:{url:json.download_url}},{quoted:m})
db.data.users[m.sender].limit -= 1
} catch (e) {
reply(util.format(e))
}
} else if (budy.startsWith('https://vt.tiktok.com/') || budy.startsWith('https://www.tiktok.com/') || budy.startsWith('https://vm.tiktok.com/')) {
if (!isPremium && db.data.users[m.sender].limit < 1) return reply(global.mess.limit);
reply('*TikTok URL Detected*\n\n_Downloading..._');
try {
let data = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${m.text}`);
if (data.images) {
reply(data.title);
let imeg = []
for (let image of data.images) {
imeg.push({image:{url:image.url}})
} 
miya.albumMessage(m.chat, imeg, m)   
} else {
await miya.sendMessage(m.chat, {video: { url: data.video.noWatermark }, caption: data.title }, { quoted: global.fake });
await miya.sendMessage(m.chat, {audio: {url:data.music.play_url}, mimetype:'audio/mp4', ptt:false},{quoted:m});
}
if (!isPremium) db.data.users[m.sender].limit -= 1;
} catch {
let res = await fetchJson(`https://api.suraweb.online/download/tiktok?url=${m.text}`)
if (res.data.media.type === "video") {
await miya.sendMessage(m.chat, {video:{url:res.data.media.video.nowm}},{quoted:m})
await miya.sendMessage(m.chat, {audio:{url:res.data.media.video.audio},mimetype:"audio/mpeg", ptt:false},{quoted:m})
} else {
let mmg = []
for (let i of res.data.media.slides) {
mmg.push({image:{url:i.url}})
}
await miya.albumMessage(m.chat, mmg, m)
await miya.sendMessage(m.chat, {audio:{url:res.data.media.video.audio},mimetype:"audio/mpeg", ptt:false},{quoted:m})
}
}
}}});
