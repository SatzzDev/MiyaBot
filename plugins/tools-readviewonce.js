const { Miya } = require('../lib/command.js');
const { downloadContentFromMessage } = require('baileys');

Miya({
command: '^(readviewonce|rvo)$',
desc:'melihat pesan 1 kali lihat',
limit: true,
type: 'Alat'
}, async (m, {command, miya}) => {
await miya.sendMessage(m.chat, {
react: {
text: "👀",
key: {
remoteJid: m.chat,
fromMe: false,
id: m.key.id,
participant: m.sender
}
}
});
m.quoted.copyNForward(m.chat, true, { rvo: true })
});
