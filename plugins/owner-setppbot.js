const { Miya } = require("../lib/command")
const { generateProfilePicture } = require("../lib/myfunc")


Miya({
command: '^(setppbot|setbotpp)$',
alias: 'setppbot',
desc: 'Mengupdate Profile Bot',
onlyOwner: true,
type: 'Owner'
}, async (m, {miya, command, reply, mime, qmsg}) => {
const { S_WHATSAPP_NET } = require("baileys");
const quoted = m.quoted ? m.quoted : m
let medis = await miya.downloadAndSaveMediaMessage(qmsg, "ppg");
var { img } = await generateProfilePicture(medis);
await miya.query({
tag: 'iq',
attrs: {
// target: '0',
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
reply("Profile picture has been changed.")
})