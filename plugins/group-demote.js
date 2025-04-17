require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: '^demote$',
alias: 'demote',
onlyGroup: true,
onlyAdmins: true,
desc: 'menurunkan jabatan admin',
type: 'Group'
}, async (m, {miya, command, text}) => {
let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"];
if (!users) return
await miya.groupParticipantsUpdate(m.chat, users, "demote").then((res) => m.reply("done")).catch((err) => m.reply("error"));
})