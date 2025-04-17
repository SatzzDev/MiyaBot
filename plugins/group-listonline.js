const { Miya } = require('../lib/command')


Miya({
command: '^listonline$',
alias: 'listonline',
desc: 'informasi anggota grup yang sedang aktif',
onlyAdmins: true,
type: 'Group'
}, async (m,  {miya, command, store}) => {
const { reply } = m;
let botNumber = await miya.decodeJid(miya.user.id);
let id = m.chat;
let online = [...Object.keys(store.presences[id]), botNumber];
reply('*List Online:*\n\n' + online.map(v => '⭔ @' + v.replace(/@.+/, '')).join('\n'));
});