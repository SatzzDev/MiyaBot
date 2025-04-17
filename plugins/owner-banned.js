const {Miya} = require("../lib/command")

Miya({
command: '^banned$',
desc: "membanned user",
type: "Owner",
onlyOwner:true,
}, async (m, {miya, text, reply}) => {
if (!m.quoted) return reply("balas pesan user")
db.data.users[m.quoted.sender].banned = true
reply(`@${m.quoted.sender.split("@")[0]} telah di banned.`)
})


Miya({
command: "^unbanned$",
desc: "membanned user",
type: "Owner",
onlyOwner:true,
}, async (m, {miya, text, reply}) => {
if (!m.quoted) return reply("balas pesan user")
db.data.users[m.quoted.sender].banned = false
reply(`@${m.quoted.sender.split("@")[0]} telah di unbanned.`)
})