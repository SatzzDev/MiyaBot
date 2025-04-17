const { Miya } = require('../lib/command');
const { fetchJson } = require('../lib/myfunc');

Miya({
    command: '^fbdl$',
    type: 'Downloader',
    limit: true
}, async (m, { miya, reply, text }) => {
if (!text) return reply(`masukan url facebooknya!`);
try {
const json = await fetchJson(`https://kaiz-apis.gleeze.com/api/fbdl-v2?url=${text}`);
if (!json.download_url) return reply('Video tidak ditemukan. Pastikan URL yang diberikan valid.');
await miya.sendMessage(m.chat, { video: { url: json.download_url } }, { quoted: m });
} catch (error) {
console.error(error);
reply('Terjadi kesalahan saat memproses permintaan. Pastikan URL yang diberikan valid.');
}
});