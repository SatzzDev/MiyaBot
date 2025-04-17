require("../config")
const { Miya } = require('../lib/command.js');
const { fetchJson, pickRandom } = require('../lib/myfunc.js')
const { ttle } = require("../lib/scrapes")



Miya({
command: '^(couple|cp)$',
alias: 'couple',
limit: true,
desc: 'Random Couple',
type: 'Internet'
}, async (m, {miya, command, reply}) => {
const { proto, generateWAMessageFromContent, generateWAMessageContent, prepareWAMessageMedia } = require('baileys');
const fetch = require('node-fetch');
let ppcouple = await fetch('https://raw.githubusercontent.com/SatzzDev/IDK/refs/heads/main/routes/utils/data/couple.json').then(response => response.json())
let result = ppcouple.result[Math.floor(Math.random() * ppcouple.result.length)]
miya.albumMessage(m.chat, [{image:{url:result.male}, caption:'male'},{image:{url:result.female}, caption:'female'}], m)
})