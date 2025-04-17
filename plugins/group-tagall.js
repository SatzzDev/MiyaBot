require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: '^tagall$',
alias: 'tagall',
onlyGroup: true,
onlyAdmins: true,
desc: 'tag semua anggota dengan pesan',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply,q} = m
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
const groupMetadata = m.isGroup ? await miya.groupMetadata(m.chat).catch((e) => { }) : ""; 
const groupName = groupMetadata.subject
const participants = m.isGroup ? await groupMetadata.participants : "";
let teks = `══✪〘 *👥 Tag All* 〙✪══\n
➲ *Pesan : ${q ? q : "empty"}*\n\n`;
for (let mem of participants) {
teks += `⭔ @${mem.id.split("@")[0]}\n`;
}
miya.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) },{ quoted: m });
})