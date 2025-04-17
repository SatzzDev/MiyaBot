const { Miya } = require('../lib/command.js');

Miya({
command: '^(sf|savefile)',
alias: 'savefile',
onlyOwner: true,
desc: 'Mengupdate file',
type: 'Owner'
}, async (m, {miya, command}) => {
if (!m.query) return m.reply(`where is the path?\n\nexample:\n${command} plugins/menu.js`)
if (!m.quoted.text) return m.reply(`reply code`)
let path = `${m.q}`
await require('fs').writeFileSync(path, m.quoted.text)
m.reply(`Saved ${path} to file!`)
});