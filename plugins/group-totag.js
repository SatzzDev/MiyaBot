require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: '^totag$',
alias: 'totag',
onlyGroup: true,
onlyAdmins: true,
desc: 'Menjadikan Pesan Apapun Sebagai Pengumuman',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply,q} = m
const groupMetadata = m.isGroup ? await miya.groupMetadata(m.chat).catch((e) => { }) : ""; 
const groupName = groupMetadata.subject
const participants = m.isGroup ? await groupMetadata.participants : "";
if (!m.quoted) return reply(`Reply pesan dengan caption ${command}`);
miya.sendMessage(m.chat, {forward: m.quoted.fakeObj, mentions: participants.map((a) => a.id)});
})