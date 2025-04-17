const { Miya } = require("../lib/command.js");
const { fetchJson } = require("../lib/myfunc");
const { lyrics } = require("../lib/lyrics")

Miya({
command: "^lirik$",
alias: 'lirik',
limit: true,
type: "Searcher",
},
async (m, { miya, command, text, reply, react}) => {
if (!text) return reply('usage example: .' + command + ' a year ago')
await react('⏳')
let response = await fetchJson(`https://api.suraweb.online/info/lyrics?q=${text.replace(" ", "+")}`)
let result = response.result[0]
reply(result.lyrics)
await react('🎉')
})