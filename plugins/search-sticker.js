require("../config")
const { Miya } = require('../lib/command.js');
const { fetchJson } = require('../lib/myfunc')

Miya({
command: 'stickersearch',
alias: 'stickersearch',
limit: true,
desc: 'Mencari stiker',
type: 'Searcher'
}, async (m, {miya, command}) => {
let {reply,q} = m
let { stickersearch } = require("../lib/scrapes")


reply(mess.wait)
let res = await fetchJson('https://api.agatz.xyz/api/sticker?message=' + q)
for (let satria of res.data.sticker_url) miya.sendImageAsSticker(m.chat, satria, m, {packname: res.data.title, author: 'krniwnstria'})
})