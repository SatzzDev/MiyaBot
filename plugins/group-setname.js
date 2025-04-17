require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: 'setnamegc|setsubject',
alias: 'setnamegc',
onlyGroup: true,
onlyAdmins: true,
desc: 'Mengubah Nama Grup',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply,q} = m
if (!q) return reply("Text ?");
await miya.groupUpdateSubject(m.chat, q).then((res) => reply('done')).catch((err) => reply("error"));
})