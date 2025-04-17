require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: 'ttp',
limit: true,
desc: 'text To Picture',
type: 'Stiker'
}, async (m, {miya, command}) => {
const {q} = m
if (!q) return m.reply('text?')
miya.sendImageAsSticker(m.chat, `https://aemt.me/ttp?text=${q}`, m, { packname: global.packname, author: global.author })
})