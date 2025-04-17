const { Miya } = require('../lib/command.js');
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")


Miya({
command: '^close$',
alias: 'close',
onlyAdmins: true,
desc: 'menutup Grup',
type: 'Group'
}, async (m, {miya, command}) => {
let {reply} = m
miya.groupSettingUpdate(m.chat, 'announcement')
})
