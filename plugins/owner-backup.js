const { Miya } = require('../lib/command.js');
const fs = require('fs');
const archiver = require('archiver');
const chalk = require("chalk")
const { sleep } = require('../lib/myfunc')

Miya({
command: '^backup$',
onlyOwner: true,
desc: 'Membackup Bot',
type: 'Owner'
}, async (m, {miya, command, reply}) => {
const tanggal = new Date().toLocaleDateString('id', { weekday: 'long' }) + ',' + ' ' + new Date().toLocaleDateString("id", {day: 'numeric', month: 'long', year: 'numeric'})
const zipFileName = `Backup MiyaBot ${tanggal}.zip`;
reply("Sedang memulai proses backup. Harap tunggu...");
const output = fs.createWriteStream(zipFileName);
const archive = archiver('zip', { zlib: { level: 9 } });
archive.pipe(output);
archive.on('warning', function(err) { if (err.code === 'ENOENT') { 
console.log(chalk.bgRedBright(chalk.black("[ ERROR ]")),
chalk.yellow(err))
} else { 
throw err 
}
});
archive.glob('**/*', { cwd: './', ignore: ['node_modules/**/*', 'session/**', '**/.*', zipFileName]});
await archive.finalize()
await miya.sendMessage(m.sender, {document: { url: `./${zipFileName}` }, caption:'Backup Pada ' + tanggal + ' Berhasil Dibuat.', mimetype: "application/zip", fileName: zipFileName}, {quoted: m})
await sleep(10000)
await fs.unlinkSync(zipFileName)
})