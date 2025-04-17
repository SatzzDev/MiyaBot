const { Miya } = require('../lib/command.js');
const { getBuffer, getRandom } = require("../lib/myfunc");
const { Catbox } = require('node-catbox')
const catbox = new Catbox()
const util = require("util")
const axios = require("axios")
const fs = require('fs')


Miya({
command: '^hd$',
limit: true,
desc: 'Remove Background',
type: 'Alat',
}, async (m, { miya, command, reply, qmsg }) => {
try {
await reply(global.mess.wait);
let media = await miya.downloadAndSaveMediaMessage(qmsg);
const link = await catbox.uploadFile({path:media});
miya.sendMessage(m.chat, { image: {url: `https://kaiz-apis.gleeze.com/api/upscale-v2?url=${link}`}, caption: global.mess.success }, { quoted: m });
} catch (err) {
//m.reply(util.format(err))
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
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