const { Miya } = require('../lib/command');
const { prepareWAMessageMedia } = require('baileys');
const speed = require("performance-now");
const { exec } = require("child_process");
const { sizeFormatter } = require('human-readable');
const os = require('os');
const {runtime} = require("../lib/myfunc")

// Formatter untuk ukuran file/memori
const formatp = sizeFormatter({
std: 'JEDEC',
decimalPlaces: 2,
keepTrailingZeroes: false,
render: (literal, symbol) => `${literal} ${symbol}B`,
});

Miya({
command: '^infobot$',
alias: 'infobot',
desc: 'Informasi tentang bot',
type: 'Informasi',
}, async (m, { miya }) => {
const memUsage = process.memoryUsage();
const totalMem = os.totalmem();
const freeMem = os.freemem();
const uptime = os.uptime();
const sysUptime = runtime(os.uptime()); 
const sysInfo = `
*Informasi Bot:*
- Nama: ${global.botname}
- Versi: 5.0.0
- Runtime: ${sysUptime}

*Informasi Sistem:*
- Platform: ${os.platform()}
- Arsitektur: ${os.arch()}
- Total Memori: ${formatp(totalMem)}
- Memori Tersedia: ${formatp(freeMem)}

*Penggunaan Memori:*
- RSS: ${formatp(memUsage.rss)}
- Heap Total: ${formatp(memUsage.heapTotal)}
- Heap Digunakan: ${formatp(memUsage.heapUsed)}
- External: ${formatp(memUsage.external)}
`;
m.reply(sysInfo);
});

Miya({
command: '^runtime$',
alias: 'runtime',
onlyOwner: false,
desc: 'informasi bot aktif',
type: 'Informasi'
}, async (m, {miya, command}) => {
m.reply(runtime(os.uptime()));
})
// Perintah untuk tes `speedtest-cli`
Miya({
command: '^speed$',
desc: 'Tes koneksi internet dengan speedtest-cli',
type: "Informasi"
}, async (m, { miya }) => {
const {key} = await miya.sendMessage(m.chat, {text:'Testing speed...'},{quoted:m})
exec('speed-test --json', (error, stdout, stderr) => {
if (error) {
miya.sendMessage(m.chat, {text:`Failed to run speedtest: ${error.message}`, edit:key},{quoted:m})
return;
}
if (stderr) {
miya.sendMessage(m.chat, {text:`Error output: ${stderr}`, edit:key},{quoted:m})
return;
}

try {
const data = JSON.parse(stdout);
const result = `*\`Speedtest Result:\`*\n\n> Ping: ${data.ping.latency} ms\n> Download: ${(data.download.bandwidth / 125000).toFixed(2)} Mbps\n> Upload: ${(data.upload.bandwidth / 125000).toFixed(2)} Mbps`;
miya.sendMessage(m.chat, {text:result, edit:key},{quoted:m})
} catch (err) {

miya.sendMessage(m.chat, {text:'Error parsing JSON speedtest', edit:key},{quoted:m})
}
});
});



// Informasi tambahan tentang memori dan sistem
Miya({
command: '^sysinfo$',
alias: 'sysinfo',
desc: 'Informasi sistem',
type: 'Informasi'
}, async (m, { miya }) => {
const memUsage = process.memoryUsage();
const totalMem = os.totalmem();
const freeMem = os.freemem();
const uptime = os.uptime();

const sysInfo = `
*Informasi Sistem:*
- Platform: ${os.platform()}
- Arsitektur: ${os.arch()}
- Total Memori: ${formatp(totalMem)}
- Memori Tersedia: ${formatp(freeMem)}
- Uptime: ${formatUptime(uptime)}
- Penggunaan Memori:
RSS: ${formatp(memUsage.rss)}
Heap Total: ${formatp(memUsage.heapTotal)}
Heap Digunakan: ${formatp(memUsage.heapUsed)}
External: ${formatp(memUsage.external)}
`;

m.reply(sysInfo);

function formatUptime(seconds) {
const d = Math.floor(seconds / 86400); // Hitung hari
const h = Math.floor((seconds % 86400) / 3600); // Hitung jam sisa
const m = Math.floor((seconds % 3600) / 60); // Hitung menit sisa
const s = Math.floor(seconds % 60); // Hitung detik sisa
return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
}

});
