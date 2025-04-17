const { Miya } = require('../lib/command.js');
const {fetchJson, getBuffer} = require("../lib/myfunc")
const request = require("request")
const cheerio = require("cheerio") 


Miya({
command: '^soundcloud$',
limit: true,
desc: 'to Download Audio From SoundCloud',
type: 'Downloader'
}, async (m, {miya, command}) => {
try {
if (!m.query) return m.reply(`input url!`)
const url = m.query;
if (url.startsWith('https://')) {
let res = await fetchJson(`https://sapisz.vercel.app/api/soundclouddl?url=${url}`)
miya.sendMessage(m.chat, {audio: await getBuffer(res.url), mimetype: "audio/mpeg", ptt: false},{ quoted: m });
} else {
let res = await fetchJson(`https://sapisz.vercel.app/api/soundcloud?query=${url}`)
let sections = res.result.map(i => ({ title: i.author, highlight_label: i.duration, rows:[ { title: i.title, description: i.created_at.split('T')[0] + ' ' + i.total_likes + ' Likes', id:  '.soundcloud ' + i.url } ] } ) ) 
miya.sendButtons(m.chat,`*– 乂 SOUND - CLOUD*`,`result of ${url}:`, global.author, [{ type: 'list', title: 'Click Here', sections }], m);
}
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
})