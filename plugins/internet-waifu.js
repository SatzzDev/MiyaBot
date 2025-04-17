const {Miya} = require('../lib/command')
const {fetchJson} = require('../lib/myfunc.js')

Miya({
command:'^waifu$',
desc:'waifu',
limit:false,
type:'Internet'
}, async(m, {miya, command}) => {
try {
let json = await fetchJson("https://api.waifu.pics/sfw/waifu");
let cap = `*– 乂 Waifu Random:*\n> 💫 *Gambar Waifu yang Baru* \n> *Ketik ${command} lagi untuk mendapatkan gambar baru!*`;
miya.sendMessage(m.chat, {
image: {url:json.url},
caption: cap,
footer: '© SiestaBot | Playground',
buttons:[{buttonId:'.waifu',buttonText:{displayText:'Next'}}],
headerType:2,
viewOnce:true
},{quoted:m});
} catch (err) {
m.reply("> ❌ Terjadi kesalahan, coba lagi nanti.");
miya.sendMessage(global.dev, {text:err.message})
}
})