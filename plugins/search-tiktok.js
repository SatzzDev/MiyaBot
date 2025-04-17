require("../config")
const { Miya } = require('../lib/command.js');
const { fetchJson } = require('../lib/myfunc')

Miya({
command: 'tiktoksearch',
alias: 'tiktoksearch',
limit: true,
desc: 'Mencari stiker',
type: 'Searcher'
}, async (m, {miya, command}) => {
let {reply,q} = m
let { stickersearch } = require("../lib/scrapes")


reply(mess.wait)
let res = await fetchJson('https://api.agatz.xyz/api/tiktoksearch?message=' + q)
await miya.sendMessage(m.chat, {video: {url:res.data.no_watermark}, caption: res.data.title},{quoted:m})
})