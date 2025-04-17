const { Miya } = require('../lib/command');
const { fetchJson } = require('../lib/myfunc');

Miya({
    command: '^threads$',
    type: 'Downloader',
    limit: true
}, async (m, { miya, command, reply, text }) => {
if (!text) return reply('Mana URL Threads-nya? Contoh: .threads https://www.threads.net/@nakoruru_r/post/DGI-C7Tvyq8');
try {
const json = await fetchJson(`https://api.threadsphotodownloader.com/v2/media?url=${text}`);
if (json.video_urls.length < 1) return reply('Video tidak ditemukan. Jika ingin download foto, unduh saja sendiri di aplikasinya.');
const all = json.video_urls.map(video => ({video: { url: video.download_url } }));
miya.albumMessage(m.chat, all); 
} catch (error) {
console.error(error);
reply('Terjadi kesalahan saat memproses permintaan.');
}
});