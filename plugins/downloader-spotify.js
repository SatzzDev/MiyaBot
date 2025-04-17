const { Miya } = require('../lib/command.js');
const {fetchJson,getBuffer} = require("../lib/myfunc")
const agent = require('fake-useragent')

Miya({
command: '^spotify$',
limit: true,
desc: 'to Download Audio From Spotify',
type: 'Downloader'
}, async (m, {miya, command, text, reply}) => {
try {
if (!text) return m.reply(`Penggunaan Salah! contoh penggunaan:\n .${command} https://spotify.com/xxxx atau .${command} somebody's pleasure extended version`)
await reply(global.mess.wait)
let url = text
if (text.startsWith('https://')) {
let res = await fetchJson('https://sapisz.vercel.app/api/spotifydl?url='+url)
await miya.sendMessage(m.chat, {
audio:await getBuffer(res.url), 
fileName:res.title + '.mp3',
mimetype:'audio/mp4', 
ptt:false
},{quoted:m})  
} else {
let res = await fetchJson(`https://sapisz.vercel.app/api/spotify?query=${url}`)
let buttons = res.results.map(i => { return [i.name,i.artists,'.spotify '+i.url]})
await miya.sendListMsgV2(
m.chat,`RESULT OF ${url}`,'', global.author, 'Click Here', 'Spotify Search', 'MATCHES', buttons, m);
}
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
});