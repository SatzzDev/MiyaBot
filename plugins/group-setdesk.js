require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: '^setdes(c|k)$',
alias: 'setdesc',
onlyGroup: true,
onlyAdmins: true,
desc: 'Mengubah Deskripsi',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply,q} = m
if (!q) return reply("Text ?");
await miya.groupUpdateDescription(m.chat, q).then((res) => reply('done')).catch((err) => reply("error"));
})