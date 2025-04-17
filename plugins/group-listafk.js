const {Miya} = require("../lib/command")
const {CS} = require("../lib/myfunc")

Miya({
command:"^listafk$",
desc:"melihat semua user yang sedang afk",
type:"Group",
}, async(m, {reply}) => {
let semuanya = Object.entries(db.data.users).filter(([_, user]) => user.afkTime > 0).map(([id, user]) => ({id: id.split("@")[0], name: user.name, reason: user.afkReason || "Tidak ada alasan", duration: CS(new Date() - user.afkTime), time: user.afkTime})).sort((a, b) => a.time - b.time).map(u => `@${u.id}\n> Nama: ${u.name}\n> Alasan: ${u.reason}\n> Selama: ${u.duration}`)
if (!semuanya.length) return reply("Tidak ada yang sedang AFK.")
reply(semuanya.join("\n\n"))
})