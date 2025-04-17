require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: "^del$",
onlyAdmins: true,
desc: 'Menghapus Pesan',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply} = m
let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : ""
if (!users) return reply("Reply pesan")
if (users == miya.user.id) {
m.quoted.delete()
} else if (users !== miya.user.id){
miya.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: users } })
} 
miya.sendMessage(m.chat, { delete: m.key  })
})