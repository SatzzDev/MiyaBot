const { Miya } = require("../lib/command")


Miya({
command: '^self$',
alias: 'self',
desc: 'mengubah mode bot menjadi self',
onlyOwner: true,
type: 'Owner'
}, async (m, {miya, command, reply}) => {
if (!miya.public) return reply(`Already in Self Mode!`)
miya.public = false;
reply("Success Change To Self Mode");
})