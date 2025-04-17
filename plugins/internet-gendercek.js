const { Miya } = require('../lib/command.js');
const {fetchJson,getBuffer} = require("../lib/myfunc")

Miya({
command: '^cat$',
alias: 'cat',
desc: "gambar kucing random", 
limit: true,
type: 'Internet'
}, async (m, {miya, command}) => {
const {q} = m
//if (!q) return m.reply(`Penggunaan Salah! contoh penggunaan:\n .${command} satria`)
let data = await fetchJson(`https://api.thecatapi.com/v1/images/search`) 
miya.sendMessage(m.chat, {image: {url:data[0].url}})
});    


Miya({
command: '^cekgender$',
alias: 'gendercek',
desc: "menebak gender berdasarkan nama", 
limit: true,
type: 'Internet'
}, async (m, {miya, command}) => {
const {q} = m
if (!q) return m.reply(`Penggunaan Salah! contoh penggunaan:\n .${command} satria`)
let data = await fetchJson(`https://api.genderize.io/?name=${q}`) 
let tkes =`*GENDER CHECK*
_Name:_ *${q}*
_Count:_ ${data.count}
_Gender:_ ${data.gender}
_Probability:_ ${data.probability}
`
m.reply(tkes)
});