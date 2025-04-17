const { Miya } = require("../lib/command") 
const {getBuffer, sleep} = require("../lib/myfunc.js")


Miya({
command:"^(bc|broadcast)$", 
alias: 'broadcast',
onlyOwner: true, 
type: "Owner", 
}, async(m, {miya, quoted, qmsg, text, reply}) => {
for (let objek of Object.keys(db.data.users)) { 
await miya.sendMessage(objek, {text: '*[ BROADCAST ]*\n\n'+ text, 
footer: global.footer,
buttons: [{buttonId: '.owner',buttonText: {displayText: 'Owner'}},{buttonId: '.menu',buttonText: {displayText: "Menu"}}],
viewOnce: true},{quoted: m});
await sleep(1000)
}
reply("broadcast done.") 
})

Miya({
command:"^bcaudio$", 
onlyOwner: true, 
type: "Owner", 
}, async(m, {miya, quoted, qmsg, text, reply}) => {
if (!m.quoted) return reply("balas audio") 
let audio = await miya.downloadMediaMessage(qmsg)
for (let objek of Object.keys(db.data.users)) { 
await miya.sendMessage(objek, {audio, ptt: true, mimetype:"audio/mp4", waveform:new Uint8Array(64), contextInfo:{
externalAdReply:{
previewType: "PHOTO", 
title:text, 
body: "BROADCAST",
mediaType: "IMAGE", 
thumbnail: await getBuffer('https://satganzdevs-api.up.railway.app/api/thmb'),
showAdAttribution: true,   
}}},{quoted:global.fake}) 
await sleep(1000)
}
reply("broadcast done.") 
})