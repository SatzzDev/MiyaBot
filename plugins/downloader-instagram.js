const { Miya } = require('../lib/command.js');
const {fetchJson,getBuffer} = require("../lib/myfunc")
const axios = require('axios');
const cheerio = require('cheerio');
function downloadIG(url) {
return new Promise((resolve, reject) => {
axios.post('https://apihut.in/api/download/videos', {"video_url":url,"type":"instagram"}).then(response =>  resolve(response.data))
.catch(err => reject(err));
});
}
Miya({
command: '^igdl$',
alias: 'igdl',
limit: true,
type: 'Downloader'
}, async (m, {miya, command}) => {
const {q} = m
if (!q) return m.reply(`Penggunaan Salah! contoh penggunaan:\n .${command} https://instagram.com/reel/xxxxx`)
const res = await downloadIG(q);
for (let i of res.result) {
miya.sendFileUrl(m.chat, i._url, '', m)
}
});