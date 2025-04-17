const { Miya } = require('../lib/command.js');
const { m } = require('../config');

Miya({
command:  '^afk$',
alias: 'afk',
onlyGroup: true,
aliases: 'afk',
desc: 'Afk',
type: 'Group'
}, async (m, {miya, command, text, reply}) => {
let user = global.db.data.users[m.sender];
user.afkTime = + new Date();
user.afkReason = text;
reply(`@${m.sender.split("@")[0]} telah AFK${text ? " dengan alasan: " + text : ""}`);
});
