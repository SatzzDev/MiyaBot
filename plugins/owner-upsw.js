const { Miya } = require('../lib/command')


Miya({
command: '^upsw$',
type:'Owner',
onlyOwner:true
}, async (m, {miya, command, text}) => {
const quoted = m.quoted ? m.quoted : null;
if (!quoted && text) {
miya.sendStatusMention({ text: text },["120363140569875100@g.us"]);
return;
}
if (quoted && quoted.mtype === "conversation") {
miya.sendStatusMention({ text: quoted.text || '' },["120363140569875100@g.us"]);
return;
}
if (quoted.mtype === "audioMessage") {
let audioData = await quoted.download();
miya.sendStatusMention({ audio: audioData, mimetype: 'audio/mp4', ptt: true },["120363140569875100@g.us"]);
}
if (quoted.mtype === "imageMessage") {
let imageData = await quoted.download();
miya.sendStatusMention({ image: imageData, caption: text || '' },["120363140569875100@g.us"]);
}
if (quoted.mtype === "videoMessage") {
let videoData = await quoted.download();
miya.sendStatusMention({ video: videoData, caption: text || '' },["120363140569875100@g.us"]);
}
});