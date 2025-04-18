require('../config')
const { Miya } = require('../lib/command.js');
const { getBuffer } = require("../lib/myfunc")

Miya({
command: '^add$',
onlyAdmins: true,
desc: 'menambahkan anggota',
type: 'Group'
}, async (m, { miya, command, text }) => {
let users = m.mentionedJid.length > 0 ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"];
let response = await miya.groupParticipantsUpdate(m.chat, users, "add")
for (let user of response) {
if (user.status === "403") {
let jid = user.jid;
let invite_code = user.content.content[0].attrs.code;
let invite_code_exp = user.content.content[0].attrs.expiration;
let teks = `Gagal menambahkan, Mengundang @${jid.split('@')[0]} menggunakan invite...`
await m.reply(teks)
await miya.sendGroupV4Invite(m.chat, jid, invite_code, invite_code_exp, false, 'Invitation to join my WhatsApp group')
}
}
})
