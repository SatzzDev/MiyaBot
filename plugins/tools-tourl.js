require('../config')
const { Miya } = require('../lib/command.js');
const fetch = require('node-fetch')
const fs = require('fs')
const FormData = require('form-data')
const { Catbox } = require("node-catbox")
const catbox = new Catbox();

Miya({
command: '^tourl$',
limit: true,
desc: 'image to url',
type: 'Alat'
}, async (m, {miya, command}) => {
let {reply} = m
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
if (!/image|video|audio|sticker|document/.test(mime)) return reply("No media found");
reply(mess.wait)
let media = await miya.downloadAndSaveMediaMessage(qmsg);
const link = await catbox.uploadFile({path:media});
let caption = `📮 *Link:*\n${link}`;
await miya.sendButtons(m.chat, "*`U P L O A D E R`*", caption, global.footer, [{type:'url',text:'Fetch Image',id:link},{type:'copy',text:'Copy Url',id:link}], m);
})

async function uploadUguu(path) {
try {
const form = new FormData;
form.append("files[]", fs.createReadStream(path));
const res = await fetch("https://uguu.se/upload.php", {
method: "POST",
headers: form.getHeaders(),
body: form
}),
json = await res.json();
return await fs.promises.unlink(path), json;
} catch (e) {
return await fs.promises.unlink(path), "Upload failed";
}
};