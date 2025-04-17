require("./config.js");
const fs = require("fs");
const moment = require("moment-timezone");
const util = require("util");
const chalk = require("chalk");
const { getGroupAdmins } = require("./lib/myfunc.js");



//━━━━━[ START OF EXPORT ]━━━━━//
module.exports = {
async handler(miya, m, chatUpdate, store) {
try {
const { reply } = m;
const { commands, handler, suggestCommand } = require("./lib/command.js");
const prefix = ".";
const body = m.mtype === "editedMessage"
? m.message.editedMessage.message.protocolMessage.editedMessage.conversation || m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage?.text || m.message.editedMessage.message.protocolMessage.editedMessage.imageMessage?.caption || m.message.editedMessage.message.protocolMessage.editedMessage.videoMessage?.caption
: m.mtype === "protocolMessage" && m.message.protocolMessage.editedMessage
? m.message.protocolMessage.editedMessage.extendedTextMessage?.text || m.message.protocolMessage.editedMessage.conversation || m.message.protocolMessage.editedMessage.imageMessage?.caption || m.message.protocolMessage.editedMessage.videoMessage?.caption
: m.mtype === "conversation" ? m.message.conversation
: m.mtype === "imageMessage" ? m.message.imageMessage.caption
: m.mtype === "videoMessage" ? m.message.videoMessage.caption
: m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text
: m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId
: m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId
: m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId
: m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id || m.text
: m.mtype === "stickerMessage" ? (m.msg.fileSha256 && m.msg.fileSha256.toString('base64') in global.db.data.sticker) ? global.db.data.sticker[m.msg.fileSha256.toString('base64')].text : "" : "";
const budy = typeof m.text == "string" ? m.text : "";
const pushname = m.pushName || "No Name";
const isMiya = body.startsWith(prefix);
const command = body
.replace(prefix, "")
.trim()
.split(/ +/)
.shift()
.toLowerCase();
var args = body.trim().split(/ +/).slice(1);
args = args.concat(["", "", "", "", "", ""]);
const botNumber = await miya.decodeJid(miya.user.id);
const isCreator = global.owner.includes(m.sender.split("@")[0])
? true
: false;
const isOwner = isCreator;
const itsMe = m.sender == botNumber ? true : false;
const from = m.chat;
const q = args.join(" ").trim();
const text = q;
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || "";
const qmsg = quoted.msg || quoted;
const senderNumber = m.sender.split("@")[0];
const sender = senderNumber;
const groupMetadata = m.isGroup ? await miya.groupMetadata(m.chat) : "";
const groupName = m.isGroup ? await groupMetadata.subject : "";
const participants = m.isGroup ? await groupMetadata.participants : "";
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : "";
const isBotAdmins = groupAdmins.includes(botNumber);
const isAdmins = groupAdmins.includes(m.sender);
const premium = JSON.parse(fs.readFileSync("./src/premium.json"));
const _prem = require("./lib/premium.js");
const isPremium = isOwner
? true
: _prem.checkPremiumUser(m.sender, premium);

global.fake = {
key: {
fromMe: false,
participant: `0@s.whatsapp.net`,
remoteJid: "0@s.whatsapp.net",
},
message: {
orderMessage: {
orderId: "594071395007984",
thumbnail: fs.readFileSync("./src/quoted.jpg"),
itemCount: new Date().getFullYear(),
status: "INQUIRY",
surface: "CATALOG",
message: `MiyaBot Verified By WhatsApp.`,
},
},
};

const react = async (emoti) => {
return miya.sendMessage(m.chat, {
react: {
text: emoti,
key: {
remoteJid: m.chat,
fromMe: false,
key: m.key,
id: m.key.id,
participant: m.sender,
},
},
});
};
const freply = async (teks) => {
return miya.sendMessage(
m.chat,
{ text: teks },
{
quoted: global.fake,
}
);
};
const isNumber = (x) => typeof x === "number" && !isNaN(x);
let user = db.data.users[m.sender];
let limitUser = 3;
if (typeof user !== "object") db.data.users[m.sender] = {};
if (user) {
if (!("name" in user)) user.name = pushname;
if (!("id" in user)) user.id = senderNumber;
if (!isNumber(user.limit)) user.limit = limitUser;
if (!isNumber(user.afkTime)) user.afkTime = -1;
if (!("afkReason" in user)) user.afkReason = "";
if (!isNumber(user.warning)) user.warning = 0;
if (!("banned" in user)) user.banned = false;
} else {
global.db.data.users[m.sender] = {
name: pushname,
id: senderNumber,
limit: limitUser,
afkTime: -1,
afkReason: "",
warning: 0,
banned:false,
};
}


if (!miya.public) {
if (!m.key.fromMe && !isCreator) return;
}
if (db.data.users[m.sender].banned === true) {
if (m.isGroup) miya.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender } })
return 
}



      
//━━━━━[ PREMIUM EXPIRED ]━━━━━//
_prem.expiredCheck(miya, premium);
//━━━━━[ END OF PREMIUM EXPIRED ]━━━━━//
if (m.key.remoteJid.includes("@broadcast")) {
miya.sendMessage(m.key.remoteJid, { react: { key: m.key, text: '👁️' } }, { statusJidList: [m.key.participant, miya.user.id] })
}
if (m.mtype === 'groupStatusMentionMessage') {
if (db.data.users[m.sender].warning === 3) {
db.data.users[m.sender].warning = 0
reply('*`[ ANTI TAG SW ]`* \n\n' + `> ANDA AKAN DI KICK KARENA TELAH MELAKUKAN TAG GROUP 3 KALI!`)
miya.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else {
db.data.users[m.sender].warning += 1
reply('*`[ ANTI TAG SW ]`* \n\n' + `> MOHON JANGAN TAG GROUP INI\n> WARNING: ${db.data.users[m.sender].warning}/3`)
miya.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender } })
}
}

if (isOwner && m.message.reactionMessage && m.message.reactionMessage.text === "❌") {
let msgs = await store.loadMessage(m.chat, m.message.reactionMessage.key.id)
//console.log(msgs)
miya.sendMessage(m.chat, { delete: { ...msgs.key } })
}
//console.log(JSON.stringify(m, null, 2))

if (!m.isGroup && m.chat !== "status@broadcast") {
const groupIds = [
"120363140569875100@g.us", 
"120363076558062611@g.us", 
"120363345101407384@g.us"  
];
let isMember = false;
for (const groupId of groupIds) {
const groupMetadata = await miya.groupMetadata(groupId);
const participants = groupMetadata.participants.map(data => data.id);
if (participants.includes(m.sender)) {
isMember = true;
break;
}
}
if (!isMember) {
return miya.sendButtons(m.chat, '*AKSES DI TOLAK❗*', 
'Anda belum terdaftar sebagai pengguna bot ini. Silakan bergabung dengan grup untuk mulai menggunakan bot.', global.footer, [{ type: "url", text: "Join", id: 'whatsapp://chat?code=G6W25LQb4Ce2i8r4Z0du1q' }], global.fake);
}
}     








//━━━━━━━━━━━━━━━[ HANDLE FUNCTION ]━━━━━━━━━━━━━━━━━//
handler.map(async (handle) => {
try {
await handle.function(m, {
chatUpdate,
miya,
budy,
store,
participants,
groupName,
groupMetadata,
isOwner,
user: db.data.users[m.sender],
isAdmins,
isBotAdmins,
isPremium,
chatUpdate,
reply,
freply,
text,
q,
qmsg,
args,
pushname,
react,
mime,
});
} catch (error) {
}
});

//━━━━━━━━━━━━━━━[ HANDLE COMMAND ]━━━━━━━━━━━━━━━━━//
if (isMiya) {
let matched = false;
await miya.sendPresenceUpdate('composing', m.chat)
for (let Miya of commands) {
if (Miya.command.test(command)) {
matched = true; 
try {
if (Miya.limit && !isPremium && db.data.users[m.sender].limit < 1)
return reply(global.mess.limit);
if (Miya.onlyPrem && !isPremium) return reply(global.mess.premium);
if (Miya.onlyOwner && !isOwner) return reply(global.mess.owner);
if (Miya.onlyAdmins && !isAdmins) return reply(global.mess.admin);
if (Miya.glimit && !isPremium && db.data.users[m.sender].glimit < 1)
return reply(global.mess.glimit);
if (Miya.onlyGroup && !m.isGroup) return reply(global.mess.group);

await Miya.function(m, {
miya,
budy,
store,
participants,
groupMetadata,
isOwner,
user: db.data.users[m.sender],
isAdmins,
isBotAdmins,
isPremium,
chatUpdate,
reply,
freply,
text,
q,
qmsg,
args,
react,
command,
});

if (Miya.limit && !isPremium) db.data.users[m.sender].limit -= 1;
//if (Miya.glimit && !isPremium) db.data.users[m.sender].glimit -= 1;
} catch (err) {
console.error(err);
miya.sendMessage(global.dev,{text: util.format(err), contextInfo: {externalAdReply: {title: "ERROR",thumbnailUrl:"https://telegra.ph/file/f1ca5cb8154286a123548.jpg",mediaType: 1,renderLargerThumbnail: true,},},},{ quoted: global.fake });
}
break; 
}
}
}
if (isMiya) {
console.log(
" ‎ ‎",
chalk.bgYellowBright(chalk.black("[ COMMAND ]")),
chalk.green(moment.tz("Asia/Jakarta").format("HH:mm")),
chalk.blue(body),
chalk.cyan("from"),
chalk.red(`${pushname}`),
m.isGroup ? `${chalk.red("in group")} ${chalk.red(groupName)}` : ""
);
}



//━━━━━━━━━━━━━━━[ ERROR ]━━━━━━━━━━━━━━━━━//
} catch (err) {
if (err.message.includes("Cannot find module")) {
let module = err.message.split("Cannot find module '")[1].split("'")[0];
let text = `Module ${module} is not installed yet.
Click the button to install.`;
return miya.sendButtons(
global.dev,
"",
text,
global.author,
[
{
type: "btn",
text: "INSTALL",
id: `$ npm install ${module} --force`,
},
],
m
);
}
console.log(
" ‎ ‎ ",
chalk.bgRedBright(chalk.black("[ ERROR ]")),
chalk.yellow(util.format(err))
);
await miya.sendMessage(
global.dev,
{
text: `*「 SYSTEM-ERROR 」*\n${util.format(err)}`,
contextInfo: {
externalAdReply: {
title: "ERROR",
thumbnailUrl: "https://telegra.ph/file/f1ca5cb8154286a123548.jpg",
mediaType: 1,
renderLargerThumbnail: true,
},
},
},
{ quoted: m }
);
}
}, //━━━━━━━━━━━━━━━[ END OF EXPORT ]━━━━━━━━━━━━━━━━━//
};
//━━━━━━━━━━━━━━━[ FILE UPDATE ]━━━━━━━━━━━━━━━━━\\
let file = require.resolve(__filename);
fs.watchFile(file, () => {
fs.unwatchFile(file);
console.log(
" ‎ ‎ ",
chalk.bgCyanBright(chalk.black("「 UPDATE 」")),
chalk.red(`${__filename}`)
);
delete require.cache[file];
require(file);
});