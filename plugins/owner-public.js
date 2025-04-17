const { Miya } = require("../lib/command")


Miya({
command: '^public$',
desc: 'mengubah mode bot menjadi public',
onlyOwner: true,
type: 'Owner'
}, async (m, {miya, command, reply}) => {
if (miya.public == true) return reply(`Already in Public Mode!`)
miya.public = true;
reply("Success Change To Public Mode");
})