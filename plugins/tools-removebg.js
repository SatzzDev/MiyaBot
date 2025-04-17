const { Miya } = require('../lib/command.js');
const request = require("request");
const fs = require("fs");
const { Catbox } = require('node-catbox')
const catbox = new Catbox()

Miya({
command: '^removebg$',
limit: true,
desc: 'Remove Background',
type: 'Alat',
}, async (m, { miya, command, reply, qmsg, mime }) => {
try {
await reply(global.mess.wait);
let media = await miya.downloadAndSaveMediaMessage(qmsg);
const link = await catbox.uploadFile({path:media});
miya.sendMessage(m.chat, { image: {url: 'https://kaiz-apis.gleeze.com/api/removebg?url=' + link}, caption: global.mess.success }, { quoted: m });
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
}
});


async function removebg(buffer) {
try {
return await new Promise(async (resolve, reject) => {
const image = buffer.toString("base64");
let res = await axios.post(
"https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
image: `data:image/png;base64,${image}`,
model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
},
);
const data = res.data?.replace(`"`, "");
console.log(res.status, data);
if (!data) return reject("failed removebg image");
resolve(data);
});
} catch (e) {
return {
msg: e
};
}
}