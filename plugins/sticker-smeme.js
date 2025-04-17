const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Miya } = require('../lib/command.js');
const { Catbox } = require('node-catbox')
const catbox = new Catbox()
const fetch = require('node-fetch')

Miya({
  command: '^(smeme|stickermeme)$',
  limit: true,
  desc: 'Membuat stiker meme',
  type: 'Stiker'
}, async (m, { miya, command, quoted, mime, qmsg, text }) => {
const { reply } = m;
if (!text) return reply(`Balas gambar dengan caption ${command} teks atas|teks bawah`);
const media = await miya.downloadAndSaveMediaMessage(qmsg);
let medias = await uploadUguu(media)
let url = medias.files[0].url
const sie = text.includes('|') ? text.split('|')[0] + '/' + text.split('|')[1] : `-/${text}`
const memeUrl = `https://api.memegen.link/images/custom/${encodeURIComponent(sie)}.png?background=${url}`;
let memeResponse;
try {
memeResponse = await axios.get(memeUrl, { responseType: 'arraybuffer' });
} catch (error) {
console.error('Error saat mengunduh meme:', error);
return reply('Gagal membuat meme.');
}
await miya.sendImageAsSticker(m.chat, memeResponse.data, m, {
packname: global.packname, author: global.author,
});
});





async function uploadUguu(path) {
try {
const form = new FormData()
form.append('files[]', fs.createReadStream(path))
const res = await fetch('https://uguu.se/upload.php', {
method: 'POST',
body: form,
headers: form.getHeaders()
})
const json = await res.json()
await fs.promises.unlink(path)
return json
} catch (e) {
await fs.promises.unlink(path)
return 'Upload failed'
}
}
