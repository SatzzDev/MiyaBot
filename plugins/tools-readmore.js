const { Miya } = require("../lib/command")




Miya({
command: '^readmore$',
desc:'membuat pesan readmore',
limit: true,
type: 'Alat'
}, async (m, {miya, command}) => {
let { reply, q } = m
if (!q) return reply("where's the text?, use example: .readmore kon|trak")
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
reply(q.split("|")[0] + readMore + q.split("|")[1])
})