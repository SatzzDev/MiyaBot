const { Miya } = require("../lib/command")
const { fetchJson, getBuffer, contextInfo } = require("../lib/myfunc")
const { ftxt } = require("../lib/scrapes")


Miya({
command: '^(quranaudio|qa)$',
alias: 'quranaudio',
type: 'Islamic'
}, async (m, {miya, command, text}) => {
if (!text) return m.reply('Enter the surah number example: .'+ command +' 23')
text = parseInt(text); 
if (text < 10) {
text = `00${text}`; 
} else if (text < 100) {
text = `0${text}`; 
}
miya.sendMessage(m.chat, {audio: {url:'https://download.quranicaudio.com/quran/yasser_ad-dussary/'+ text +'.mp3'}, ptt:true, mimetype:'audio/mpeg', waveform: new Uint8Array(64), contextInfo},{quoted:m})
})