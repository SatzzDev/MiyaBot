const { Miya, Handler } = require('../lib/command')
const { Catbox } = require("node-catbox")
const catbox = new Catbox();

Miya({
command:'^addrespon$',
onlyOwner:true,
}, async (m, {miya, command, text, budy, qmsg}) => {
miya.respon = db.data.response
if (!m.quoted) return m.reply("Balas Pesan yang ingin dijadikan Respon bot!")
if (!text) return m.reply('Masukan text yang akan di respon!')
let media = await miya.downloadAndSaveMediaMessage(qmsg);
const url = await catbox.uploadFile({path:media});
miya.respon[text.toLowerCase()] = {
tipe: m.quoted.mtype.split('message')[0].toLowerCase(),
url
}
m.reply("✅ Berhasil Menambahkan Respon ke database bot");
})

Miya({
command:'^delrespon$',
onlyOwner:true,
}, async (m, {miya, command, text, budy}) => {
miya.respon = db.data.response
if (!text) return m.reply('Masukan nama respon yang akan di hapus!')
if (!miya.respon[text.toLowerCase()]) return m.reply("❌ Nama tidak ditemukan didalam database bot!")
delete miya.respon[text.toLowerCase()]
m.reply("✅ Berhasil Menghapus dari database bot");
})

Miya({
command:'^listrespon$',
onlyOwner:true,
}, async (m, {miya, command, text, budy}) => {
miya.respon = db.data.response
let data = Object.keys(miya.respon).map(v => '> ' + v).join('\n');
if (!data) return m.reply("❌ Tidak ada respon yang tersimpan di database bot")
m.reply(`📄 Daftar Respon Tersimpan:\n\n${data}`);
})

Handler(async (m, { miya, user, body, isPremium, react, mime, qmsg, reply, freply }) => {
miya.respon = db.data.response
let responses = Object.keys(miya.respon);
let data = body.toLowerCase().split(" ")[0]
if (responses.includes(data)) {
let responData = miya.respon[data]
miya.sendMessage(m.chat, { [responData.tipe.split('message')[0]]: { url: responData.url } }, { quoted: m })
}
})
