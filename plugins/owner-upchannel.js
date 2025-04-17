const { Miya } = require('../lib/command')


Miya({
command: '^upch$',
type:'Owner',
onlyOwner:true
}, async (m, {miya, command, text}) => {
const quoted = m.quoted ? m.quoted : null;
if (!quoted && text) {
miya.sendMessage("120363229748458166@newsletter",{ text: text });
return;
}
if (quoted && quoted.mtype === "conversation") {
miya.sendMessage("120363229748458166@newsletter", { text: quoted.text || '' });
return;
}
if (quoted.mtype === "audioMessage") {
let audioData = await quoted.download();
miya.sendMessage("120363229748458166@newsletter",{ audio: audioData, mimetype: 'audio/mp4', ptt: true });
}
if (quoted.mtype === "imageMessage") {
let imageData = await quoted.download();
miya.sendMessage("120363229748458166@newsletter",{ image: imageData, caption: text || '' });
}
if (quoted.mtype === "videoMessage") {
let videoData = await quoted.download();
miya.sendMessage("120363229748458166@newsletter",{ video: videoData, caption: text || '' });
}
});