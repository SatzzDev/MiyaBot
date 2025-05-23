const { Miya } = require("../lib/command") 
const fs = require('fs');


Miya({
command: '^(rename|rf)$',
alias: 'rename',
onlyOwner: true,
desc: 'rename file.',
type: 'Owner'
}, async (m, {miya, command}) => {
if (!m.query) return m.reply(`where is the text?\n\nexample: .${command} message/case.js|message/handler.js`)
let filename = m.query.split("|")[0]
let newFileName = m.query.split("|")[1]
if (!fs.existsSync(filename)) return m.reply(`'${filename}' not found!`)
fs.rename(filename, newFileName, (err) => {
if (err) throw err;
reply(`renamed ${filename} to ${newFileName}`);
});
})