require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")


Miya({
command: '^setppgc$',
alias: 'setppgc',
onlyGroup: true,
onlyAdmins: true,
desc: 'Mengubah Profil Grup',
type: 'Group'
}, async (m, {reply, miya, command, text}) => {
const { jidNormalizedUser, S_WHATSAPP_NET } = require("baileys")
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
if (!quoted) return reply(`Kirim/Reply Image Dengan Caption ${command}`);
if (!/image/.test(mime) || /webp/.test(mime)) return reply(`Kirim/Reply Image Dengan Caption ${command}`);
var mediz = await miya.downloadAndSaveMediaMessage(quoted, "src/ppgc");
if (text == `/full`) {
var { img } = await generateProfilePicture(mediz);
await miya.query({
tag: 'iq',
attrs: {
to: jidNormalizedUser(m.chat),
target: m.chat,
to: S_WHATSAPP_NET,
type: 'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
} else {
await miya.updateProfilePicture(m.chat, { url: mediz });
}
reply(`Sukses`);
})