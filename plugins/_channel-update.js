const { Handler } = require('../lib/command');
const { fetchJson } = require("../lib/myfunc");
const cheerio = require('cheerio');
const util = require('util')
const axios = require('axios');

Handler(async (m, { miya, user, budy, isPremium, react, mime, qmsg, reply }) => {
if (m.isGroup && m.chat === "120363345101407384@g.us") {
if (budy.startsWith("https://") && budy.includes("instagram.com")) {
try {
react('⏳');
const res = await fetchJson(`https://kaiz-apis.gleeze.com/api/insta-dl?url=${m.text}`);
miya.sendFileUrl("120363229748458166@newsletter", res.download_url, '', m);
react('✈️');
} catch (e) {
console.error(util.format(e));
}
} else if (budy.startsWith('https://vt.tiktok.com/') || budy.startsWith('https://www.tiktok.com/') || budy.startsWith('https://vm.tiktok.com/')) {
react('⏳');
let data = await fetchJson(`https://api.tiklydown.eu.org/api/download?url=${m.text}`);   
let msgData = await miya.sendMessage("120363229748458166@newsletter", {video: { url: data.video.noWatermark }});
await miya.sendMessage(m.chat, {text:'done'},{quoted:msgData})
}
}
})