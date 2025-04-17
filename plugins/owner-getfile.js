const { Miya } = require('../lib/command.js');
const fs = require('fs')
const path = require('path')

Miya({
command: '^(getfile|gf)$',
alias: 'getfile',
onlyOwner: true,
desc: 'Mengambil File',
type: 'Owner'
}, async (m, {miya, command}) => {
if (!m.query) return m.reply(`where is the text?\n\nexempel: .gp message/case.js`)
let filename = m.query
if (!fs.existsSync(filename)) return m.reply(`'${filename}' not found!`)
miya.sendButtons(m.chat, '`GET PLUGINS`', fs.readFileSync(filename, 'utf8'), '© ꜱᴀᴛɢᴀɴᴢᴅᴇᴠꜱ', [{type:'copy', text:'Copy Code', id:fs.readFileSync(filename, 'utf8')}],m)
})