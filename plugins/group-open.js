require('../config')
const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {ftxt, ttle} = require('../lib/scrapes')

Miya({
command: '^open$',
alias: 'open',
onlyAdmins: true,
desc: 'Membuka Grup',
type: 'Group'
}, async (m, {miya, command}) => {
miya.groupSettingUpdate(m.chat, 'not_announcement')
})
