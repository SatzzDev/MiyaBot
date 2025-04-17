require('../config');
const { Miya } = require('../lib/command.js');
const { CS, jsonformat, reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc");
;

Miya({
command: '^wallpaperanime$',
alias: 'wallpaper',
limit: true,
desc: 'get wallpaper',
type: 'Alat'
}, async (m, {miya, command, reply}) => {
let ress = await fetchJson("https://raw.githubusercontent.com/SatzzDev/database/refs/heads/master/wallpaper/anime.json")
let res = await pickRandom(ress[0].mobile)
miya.sendMessage(m.chat, {image: {url:res},
caption: global.mess.success,
footer: "@krniwnstria",
buttons:[{buttonId:".wallpaperanime",buttonText:{displayText:"Next"}, type:1}],
headerType:2,
viewOnce:true},{quoted:m});
});