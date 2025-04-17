const { Miya } = require('../lib/command.js');
const { proto,
prepareWAMessageMedia,
generateWAMessageFromContent } = require("baileys") 
const fs = require('fs');
const path = require('path');

Miya({
command: '^(getplugins|gp)',
onlyOwner: true,
desc: 'Mendapatkan plugins',
type: 'Owner'
}, async (m, { miya, command, text }) => {
const listPlugins = fs.readdirSync(__dirname).filter(file => file.endsWith('.js')).map(file => file.replace(/\.js$/, ''));
let plug = listPlugins.map(v => { return [v, ".gp "+ v] });
if (!text) return miya.sendListMsg(
m.chat,
`ALL PLUGINS`,
'',
global.author,
'List Plugins',
'💀',
'a',
plug,
m
);
const filename = path.join(__dirname, `${text}${!/\.js$/i.test(text) ? '.js' : ''}`);
if (!fs.existsSync(filename)) {
return miya.sendListMsg(
m.chat,
`'${filename}' not found!`,
'',
global.author,
'List Plugins',
'💀',
'a',
plug,
m
);
}
const code = fs.readFileSync(filename, 'utf8');
await miya.sendButtons(m.chat, 'GET PLUGINS', code, global.footer, [{type:"copy",text:'Salin',id:code}], m);
});
