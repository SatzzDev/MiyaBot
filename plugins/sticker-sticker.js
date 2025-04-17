const { Miya } = require('../lib/command.js');


Miya({
command: '^(s|stiker|sticker)$',
limit: true,
desc: 'video/image to sticker',
type: 'Stiker'
}, async (m, {miya, command}) => {
let {reply} = m
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
if (/image/.test(mime)) {
let media = await miya.downloadMediaMessage(qmsg);
miya.sendImageAsSticker(m.chat, media, m, {pack: global.packname, author: global.author});
} else if (/video/.test(mime)) {
let media = await miya.downloadMediaMessage(qmsg);
let encmedia = await miya.sendVideoAsSticker(m.chat, media, m, {packname: global.packname, author: global.author});
await fs.unlinkSync(encmedia);
} else reply(`Kirim/reply gambar/video/gif dengan caption ${command}\nDurasi Video/Gif 1-9 Detik`);
})