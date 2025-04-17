const { Miya } = require('../lib/command.js');
const { sleep } = require('../lib/myfunc.js');

// Command to restart the bot
Miya({
command: '^(restart)$',
alias: 'restart',
onlyOwner: true,
desc: 'Restart The Bot',
type: 'Owner'
}, async (m, {miya, command}) => {
try {
if (!db.data.others['restarts']) {
db.data.others['restarts'] = {};
}
let { key } = await miya.sendMessage(m.chat, { text: `_Restarting..._` }, { quoted: m });
db.data.others['restarts'].key = key;
db.data.others['restarts'].from = m.chat;
await db.write();
await sleep(1000);
process.send('reset');
} catch (error) {
console.error('Failed to restart the bot:', error);
await miya.sendMessage(m.chat, { text: 'Failed to restart the bot. Please try again later.' }, { quoted: m });
}
});