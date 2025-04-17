const { Miya } = require('../lib/command.js');
const {fetchJson, getBuffer} = require("../lib/myfunc")
const request = require("request")
const cheerio = require("cheerio") 


Miya({
command: '^xnxx$',
limit: true,
desc: 'Download Video From Xnxxx',
type: 'Downloader'
}, async (m, {miya, command, text}) => {
if (!m.query) return m.reply(`input url!`)
await m.reply(global.mess.wait)
const url = text
if (url.startsWith('https://')) {
let res = await getBuffer(`https://api.satzzdev.xyz/api/xnxxdl?url=${url}`)
await miya.sendMessage(m.chat, {video: res, caption:'dosa tanggung sendiri ya🗿', mimetype: "video/mp4", ptt: false},{ quoted: m });
} else {
let res = await fetchJson(`https://api.satzzdev.xyz/api/xnxxsearch?query=${url}`)
let buttons = res.results.map(i => { return [i.title,i.info.replace('/n',''),'.xnxx '+ i.link] }) 
miya.sendListMsgV2(m.chat, `RESULT OF ${url}`,'', global.author, 'Click Here', 'Xnxx Search', 'MATCHES', buttons, m);
}
})