const {
default: makeWASocket, 
areJidsSameUser,
DisconnectReason,
downloadContentFromMessage,
fetchLatestBaileysVersion,
generateForwardMessageContent,
delay,
generateMessageID,
generateWAMessage,
generateWAMessageFromContent,
getAggregateVotesInPollMessage,
getContentType,
jidDecode,
makeCacheableSignalKeyStore,
makeInMemoryStore,
MessageRetryMap,
prepareWAMessageMedia,
useMultiFileAuthState,
WAMessageStubType,
proto,
} = require("baileys")
const fs = require('fs');
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const readline = require("readline");
const axios = require('axios')
const FileType = require('file-type')
const yargs = require('yargs/yargs')
const NodeCache = require('node-cache')
const _ = require('lodash')
const crypto = require("crypto")
const { Boom } = require('@hapi/boom')
const { exec } = require('child_process');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const { getBuffer, fetchJson, pickRandom, sleep, clockString, runtime } = require("./myfunc")
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

exports.Socket = (connectionOptions, options = {}) => {
const miya = makeWASocket(connectionOptions)



//LOAD MESSAGES
miya.loadMessage = (messageID) => {
return Object.entries(miya.chats).filter(([_, { messages }]) => typeof messages === 'object').find(([_, { messages }]) => Object.entries(messages).find(([k, v]) => (k === messageID || v.key?.id === messageID))) ?.[1].messages?.[messageID]
}

miya.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

if (miya.user && miya.user.id) miya.user.jid = miya.decodeJid(miya.user.id)
miya.chats = {}
miya.contacts = {}

miya.saveName = async (id, name = '') => {
if (!id) return
id = miya.decodeJid(id)
let isGroup = id.endsWith('@g.us')
if (id in miya.contacts && miya.contacts[id][isGroup ? 'subject' : 'name'] && id in miya.chats) return
let metadata = {}
if (isGroup) metadata = await miya.groupMetadata(id)
let chat = { ...(miya.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc } : { name }) }
miya.contacts[id] = chat
miya.chats[id] = chat
}

miya.getName = (jid = '', withoutContact = false) => {
let myUser = Object.keys(db.data.users)
let nana = myUser.includes(jid) ? 'User terdeteksi' : 'User tidak terdeteksi'
let jod = jid
jid = miya.decodeJid(jid)
withoutContact = miya.withoutContact || withoutContact
let v
if (jid.endsWith('@g.us')) {
return miya.groupMetadata(jid).then((v) => {
return v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
})
} else {
v = jid === '0@s.whatsapp.net' ? { jid, vname: 'WhatsApp' } : areJidsSameUser(jid, miya.user.id) ? miya.user : (miya.chats[jid] || {})
return Promise.resolve((withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || (myUser.includes(jod) ? db.data.users[jod].name : PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international').replace(new RegExp("[()+-/ +/]", "gi"), "")))
}
}

miya.serializeM = (m) => smsg(miya, m, store)
// Fungsi untuk memproses tipe pesan stub
miya.processMessageStubType = async (m) => {
if (!m.messageStubType) return;
const chat = miya.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '');
if (!chat || chat === 'status@broadcast') return;
const emitGroupUpdate = (update) => {
ev.emit('groups.update', [{ id: chat, ...update }]);
};
console.log({
messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters,
type: WAMessageStubType[m.messageStubType],
});
const isGroup = chat.endsWith('@g.us');
if (!isGroup) return;
let chats = miya.chats[chat];
if (!chats) chats = miya.chats[chat] = { id: chat };
chats.isChats = true;
const metadata = await miya.groupMetadata(chat).catch(_ => null);
if (!metadata) return;
chats.subject = metadata.subject;
chats.metadata = metadata;
};

// Fungsi untuk memasukkan semua grup
miya.insertAllGroup = async () => {
const groups = await miya.groupFetchAllParticipating().catch(_ => null) || {};
for (const group in groups) {
miya.chats[group] = {
...(miya.chats[group] || {}),
id: group,
subject: groups[group].subject,
isChats: true,
metadata: groups[group],
};
}
return miya.chats;
};

// Fungsi untuk memproses dan memasukkan pesan ke dalam chat
miya.pushMessage = async (m) => {
if (!m) return;
if (!Array.isArray(m)) m = [m];
for (const message of m) {
try {
if (!message) continue;
if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) {
miya.processMessageStubType(message).catch(console.error);
}
const _mtype = Object.keys(message.message || {});
const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) || (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) || _mtype[_mtype.length - 1];
const chat = miya.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '');
if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
let context = message.message[mtype].contextInfo;
let participant = miya.decodeJid(context.participant);
const remoteJid = miya.decodeJid(context.remoteJid || participant);
let quoted = message.message[mtype].contextInfo.quotedMessage;
if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
let qMtype = Object.keys(quoted)[0];
if (qMtype == 'conversation') {
quoted.extendedTextMessage = { text: quoted[qMtype] };
delete quoted.conversation;
qMtype = 'extendedTextMessage';
}
if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {};
quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || [];
const isGroup = remoteJid.endsWith('g.us');
if (isGroup && !participant) participant = remoteJid;
const qM = {
key: {
remoteJid, 
fromMe: areJidsSameUser(miya.user.jid, remoteJid),
id: context.stanzaId, 
participant,
},
message: JSON.parse(JSON.stringify(quoted)),
...(isGroup ? { participant } : {}),
};
let qChats = miya.chats[participant];
if (!qChats) qChats = miya.chats[participant] = { id: participant, isChats: !isGroup };
if (!qChats.messages) qChats.messages = {};
if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM;
let qChatsMessages;
if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) {
qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length));
}
}
}
if (!chat || chat === 'status@broadcast') continue;
const isGroup = chat.endsWith('@g.us');
let chats = miya.chats[chat];
if (!chats) {
if (isGroup) await miya.insertAllGroup().catch(console.error);
chats = miya.chats[chat] = { id: chat, isChats: true, ...(miya.chats[chat] || {}) };
}
let metadata, sender;
if (isGroup) {
if (!chats.subject || !chats.metadata) {
metadata = await miya.groupMetadata(chat).catch(_ => ({})) || {};
if (!chats.subject) chats.subject = metadata.subject || '';
if (!chats.metadata) chats.metadata = metadata;
}
sender = miya.decodeJid(message.key?.fromMe && miya.user.id || message.participant || message.key?.participant || chat || '');
if (sender !== chat) {
let senderChats = miya.chats[sender];
if (!senderChats) senderChats = miya.chats[sender] = { id: sender };
if (!senderChats.name) senderChats.name = message.pushName || senderChats.name || '';
}
} else if (!chats.name) {
chats.name = message.pushName || chats.name || '';
}
if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue;
chats.isChats = true;
if (!chats.messages) chats.messages = {};
const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, miya.user.id);
if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
delete message.message.messageContextInfo;
delete message.message.senderKeyDistributionMessage;
chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2));
let chatsMessages;
if ((chatsMessages = Object.entries(chats.messages)).length > 40) {
chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length));
}
}
} catch (e) {
console.error(e);
}
}
};



miya.sendContact = async (jid, kon, nama, quoted = '', opts = {}) => {
let list = [{
displayName: nama,
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${nama}\nFN:${nama}\nitem1.TEL;waid=${kon}:${PhoneNumber('+' + kon).getNumber('international')}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:satganzdevs@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://chat.whatsapp.com/HbCl8qf3KQK1MEp3ZBBpSf\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`}]
miya.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
}

miya.sendPoll = (jid, name = "", values = [], selectableCount = 1) => {
return miya.sendMessage(jid, { poll: { name, values, selectableCount } });
};   
miya.public = true  
miya.maintenance = false
const { proto, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent } = require('baileys');

// Fungsi untuk mengirim pesan interaktif tanpa gambar
miya.sendButton = async (id, title, text, footer, buttons, quoted) => {
let message = generateWAMessageFromContent(id, proto.Message.fromObject({
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2,
},
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create({
title,
hasMediaAttachment: false
}),
body: proto.Message.InteractiveMessage.Body.create({ text }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons }), 
contextInfo: {
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g), ...title.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || ''
}
})
}
}
}), { quoted, userJid: id });
return miya.relayMessage(id, message.message, { quoted, messageId: message.key.id });
}

miya.sendButtonV2 = async (id, image, title, text, footer, buttons, quoted) => {
try {
let { imageMessage } = await generateWAMessageContent({ image }, { upload: miya.waUploadToServer });
let message = generateWAMessageFromContent(id, proto.Message.fromObject({
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create({
hasMediaAttachment: false
}),
body: proto.Message.InteractiveMessage.Body.create({ text:"" }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: "" }),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: [
{
body: proto.Message.InteractiveMessage.Body.fromObject({ text }),
footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footer }),
header: proto.Message.InteractiveMessage.Header.fromObject({hasMediaAttachment: true,imageMessage}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
}
], 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
}),
contextInfo: {
isForwarded:true,
forwardedNewsletterMessageInfo:{
newsletterJid: "120363229748458166@newsletter", 
serverMessageId: 100,
ContentType: 2,
newsletterName:global.newsletterName,
},
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || ''
}
})
}
}
}), { quoted, userJid: id });
return miya.relayMessage(id, message.message, { quoted, messageId: message.key.id });
} catch (error) {
console.error("Error sending carousel message:", error);
}
};




miya.sendListMsg = async (id, title, text, footer, buText, secTitle, label, rows, quoted) => {
let but = [];
rows.map(button => {
but.push({title: button[0], id: button[1]})
});
const rowr = [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: buText,
sections: [{
title: secTitle,
highlight_label: label,
rows: but // Menggunakan array yang sudah diformat
}]
})
}];
return miya.sendButton(id, title, text, footer, rowr, quoted);
}



miya.sendList = async (id, title, text, footer, buText, sections, quoted) => {
const rowr = [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: buText,
sections: sections.map(([secTitle, buttons]) => ({
title: secTitle,
rows: buttons.map(button => ({ title: button.title, id: button.id }))
}))
})
}];
return miya.sendButton(id, title, text, footer, rowr, quoted);
}




miya.sendListMsgV3 = async (id, title, text, footer, buText, sections, quoted) => {
const rowr = [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: buText,
sections
})
}];
return miya.sendButton(id, title, text, footer, rowr, quoted);
}




miya.sendListMsgV2 = async (id, title, text, footer, buText, secTitle, label, rows, quoted) => {
let { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require('baileys')
let but = [];
rows.map(button => {
but.push({title: button[0], description: button[1], id: button[2]})
});
const rowr = [{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: buText,
sections: [{
title: secTitle,
highlight_label: label,
rows: but // Menggunakan array yang sudah diformat
}]
})
}];
let msg = generateWAMessageFromContent(id, proto.Message.fromObject({viewOnceMessage: {message: {"messageContextInfo": {"deviceListMetadata": {},"deviceListMetadataVersion": 2},
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create({
title, 
subtitle: title,
hasMediaAttachment: false
}),
body: proto.Message.InteractiveMessage.Body.create({text: text}),
footer: proto.Message.InteractiveMessage.Footer.create({text: footer}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({buttons:rowr}),
contextInfo:{ 
isForwarded: true, 
forwardingScore: 1000, 
forwardedNewsletterMessageInfo:{
newsletterJid: "120363229748458166@newsletter", 
serverMessageId: 100,
ContentType: 2,
newsletterName:global.newsletterName,
},
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g),...title.matchAll(/@([0-9]{5,16}|0)/g),...footer.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") ||''}})}}}), {quoted, userJid: id})
return miya.relayMessage(id, msg.message, {quoted, messageId: msg.key.id})
//return miya.sendButton(id, title, text, footer, rowr, quoted);
}




miya.sendButtonText = async(id, title, text, footer, button, quoted) => {
return miya.sendButton(id, title, text, footer, [{name: 'quick_reply', buttonParamsJson: JSON.stringify(button)}], quoted)
}





miya.sendMediaButtons = async (id, title, text, footer, buttons = [], quoted = '', options = {}) => {
const formattedButtons = [];
for (const button of buttons) {
let buttonParamsJson;
if (button.type === 'copy') {
buttonParamsJson = JSON.stringify({ display_text: button.text, id: '12345', copy_code: button.id });
} else if (button.type === 'url') {
buttonParamsJson = JSON.stringify({ display_text: button.text, url: button.id, merchant_url: button.id });
} else if (button.type === 'btn') {
buttonParamsJson = JSON.stringify({ title: button.text, payload: button.id });
}
formattedButtons.push({
name: button.type === 'copy'? 'cta_copy' : (button.type === 'url'? 'cta_url' : 'quick_reply'),
buttonParamsJson: buttonParamsJson
});
}
let hasMediaAttachment = true;
let media = null;
if (options.img) {
media = await prepareWAMessageMedia({ image: { url: options.img } }, { upload: miya.waUploadToServer });
} else if (options.video) {
media = await prepareWAMessageMedia({ video: { url: options.video },  }, { upload: miya.waUploadToServer });
} else {
hasMediaAttachment = false;
}

const msg = generateWAMessageFromContent(id,
proto.Message.fromObject({
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create({
title,
subtitle: "",
imageMessage: media.imageMessage ? media.imageMessage : null,
videoMessage: media.videoMessage ? media.videoMessage : null,
hasMediaAttachment: hasMediaAttachment
}),
body: proto.Message.InteractiveMessage.Body.create({ text }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: formattedButtons }),
contextInfo: {
isForwarded: true,
forwardingScore: 1000,
forwardedNewsletterMessageInfo:{
newsletterJid: "120363229748458166@newsletter", 
serverMessageId: 100,
ContentType: 2,
newsletterName:global.newsletterName,
},
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || ''
}
})
}
}
}), { quoted, userJid: id });

return miya.relayMessage(id, msg.message, { quoted, messageId: msg.key.id });
}





miya.sendbutGif = async (id, title, text, footer, buttons = [], quoted = '', options = {}) => {
const formattedButtons = [];
for (const button of buttons) {
let buttonParamsJson;
if (button.type === 'copy') {
buttonParamsJson = JSON.stringify({ display_text: button.text, id: '12345', copy_code: button.id });
} else if (button.type === 'url') {
buttonParamsJson = JSON.stringify({ display_text: button.text, url: button.id, merchant_url: button.id });
} else if (button.type === 'btn') {
buttonParamsJson = JSON.stringify({ display_text: button.text, id: button.id });
}
formattedButtons.push({
name: button.type === 'copy'? 'cta_copy' : (button.type === 'url'? 'cta_url' : 'quick_reply'),
buttonParamsJson: buttonParamsJson
});
}
let hasMediaAttachment = true;
let media = await prepareWAMessageMedia({ video: { url: options.video, gifPlayback:true }, gifPlayback:true }, { gifPlayback: true, upload: miya.waUploadToServer });
const msg = generateWAMessageFromContent(id,
proto.Message.fromObject({
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create({
title,
subtitle: "",
videoMessage: media.videoMessage,
hasMediaAttachment: true
}),
body: proto.Message.InteractiveMessage.Body.create({ text }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: formattedButtons }),
contextInfo: {
isForwarded: true,
forwardingScore: 1000,
forwardedNewsletterMessageInfo:{
newsletterJid: "120363229748458166@newsletter", 
serverMessageId: 100,
ContentType: 2,
newsletterName:global.newsletterName,
},
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || ''
}
})
}
}
}), { quoted, userJid: id });
return miya.relayMessage(id, msg.message, { quoted, messageId: msg.key.id });
}





miya.sendEditMsg = async (jid, strings = [], quoted, timer = 1000) => {
let { key } = await miya.sendMessage(jid, { text: strings[0] }, { quoted });
await sleep(timer)
const sendWithDelay = async (index) => {
if (index < strings.length) {
await miya.sendMessage(jid, { text: strings[index], edit: key });
setTimeout(() => sendWithDelay(index + 1), timer);
}
};
return sendWithDelay(1);
};



    
    
miya.sendButtons = async (id, title, text, footer, buttons = [], quoted = '', options = {}) => {
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require('baileys');

const formattedButtons = buttons.map(button => {
const buttonTypes = {
copy: () => JSON.stringify({ display_text: button.text, id: '12345', copy_code: button.id }),
call: () => JSON.stringify({ display_text: button.text, phone_number: button.id }),
url: () => JSON.stringify({ display_text: button.text, url: button.id }),
btn: () => JSON.stringify({ display_text: button.text, id: button.id }),
list: () => JSON.stringify({
title: button.title || 'Menu',
sections: button.sections
})
};

const buttonType = button.type || 'btn';
const buttonParamsJson = buttonTypes[buttonType] ? buttonTypes[buttonType]() : buttonTypes.btn();

return {
name: buttonType === 'copy' ? 'cta_copy' :
buttonType === 'call' ? 'cta_call' :
buttonType === 'url' ? 'cta_url' :
buttonType === 'list' ? 'single_select' : 'quick_reply',
buttonParamsJson
};
});

let imageMessage = null;
if (options.img) {
const buffer = Buffer.isBuffer(options.img)
? options.img
: /^data:.*?\/.*?;base64,/i.test(options.img)
? Buffer.from(options.img.split(',')[1], 'base64')
: /^https?:\/\//.test(options.img)
? await getBuffer(options.img)
: fs.existsSync(options.img)
? fs.readFileSync(options.img)
: null;

if (buffer) {
const media = await prepareWAMessageMedia({ image: buffer }, { upload: miya.waUploadToServer });
imageMessage = media.imageMessage;
}
}
const headerContent = imageMessage ? { hasMediaAttachment: true, imageMessage, title } : { title };
const msg = generateWAMessageFromContent(id, proto.Message.fromObject({
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
header: proto.Message.InteractiveMessage.Header.create(headerContent),
body: proto.Message.InteractiveMessage.Body.create({ text }),
footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: formattedButtons }),
contextInfo: {
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + "@s.whatsapp.net") || '',
}
})
}
}
}), { quoted, userJid: id });
return miya.relayMessage(id, msg.message, { quoted, messageId: msg.key.id });
};


    
miya.albumMessage = async (jid, array, quoted) => {
const album = generateWAMessageFromContent(jid, {
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
},

albumMessage: {
expectedImageCount: array.filter((a) => a.hasOwnProperty("image")).length,
expectedVideoCount: array.filter((a) => a.hasOwnProperty("video")).length,
},
}, {
userJid: miya.user.jid,
quoted,
upload: miya.waUploadToServer
});

await miya.relayMessage(jid, album.message, {
messageId: album.key.id,
});

for (let content of array) {
const img = await generateWAMessage(jid, content, {
upload: miya.waUploadToServer,
});

img.message.messageContextInfo = {
messageSecret: crypto.randomBytes(32),
messageAssociation: {
associationType: 1,
parentMessageKey: album.key,
},    
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
forwardingScore: 99999,
isForwarded: true,
mentionedJid: [jid],
starred: true,
labels: ["Y", "Important"],
isHighlighted: true,
businessMessageForwardInfo: {
businessOwnerJid: jid,
},
dataSharingContext: {
showMmDisclosure: true,
},
};

img.message.forwardedNewsletterMessageInfo = {
newsletterJid: "0@newsletter",
serverMessageId: 1,
newsletterName: `WhatsApp`,
contentType: 1,
timestamp: new Date().toISOString(),
senderName: "✧ SatzzDev",
content: "Text Message",
priority: "high",
status: "sent",
};

img.message.disappearingMode = {
initiator: 3,
trigger: 4,
initiatorDeviceJid: jid,
initiatedByExternalService: true,
initiatedByUserDevice: true,
initiatedBySystem: true,
initiatedByServer: true,
initiatedByAdmin: true,
initiatedByUser: true,
initiatedByApp: true,
initiatedByBot: true,
initiatedByMe: true,
};

await miya.relayMessage(jid, img.message, {
messageId: img.key.id,
quoted: {
key: {
remoteJid: album.key.remoteJid,
id: album.key.id,
fromMe: true,
participant: miya.user.jid,
},
message: album.message,
},
});
}
return album;
};


miya.sendStatusMention = async (content, jids = []) => {
let users;
for (let id of jids) {
let userId = await miya.groupMetadata(id);
users = await userId.participants.map(u => miya.decodeJid(u.id));
};
let message = await miya.sendMessage("status@broadcast", content, {
backgroundColor: "#000000",
font: Math.floor(Math.random() * 9),
statusJidList: users,
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: jids.map((jid) => ({
tag: "to",
attrs: { jid },
content: undefined,
})),
},
],
},
],
}
);

jids.forEach(id => {
miya.relayMessage(id, {
groupStatusMentionMessage: {
message: {
protocolMessage: {
key: message.key,
type: 25,
},
},
},
},
{
userJid: miya.user.jid,
additionalNodes: [
{
tag: "meta",
attrs: { is_status_mention: "true" },
content: undefined,
},
],
});
delay(2500);
});
return message;
};


miya.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer} 

miya.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await miya.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })}





//Funtion o geing file 
miya.getFile = async (PATH, returnAsFilename) => {
let res, filename
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename) (filename = path.join('../' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data
}
}

miya.sendText = (jid, text, quoted = '', options) => miya.sendMessage(jid, { text: text, ...options }, { quoted })


miya.adReply = (jid, text, title = '', body = '', buffer, sourceUrl = '', quoted, options) => {
return miya.sendMessage(jid, { text, 
contextInfo: {
mentionedJid: [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net"),
externalAdReply: {
showAdAttribution: true,
mediaType: 1,
title,
body,
thumbnail:buffer,
renderLargerThumbnail: true,
sourceUrl
}
}
},{ quoted: quoted, ...options})
}



miya.sendTextWithMentions = async (jid, text, quoted, options = {}) => miya.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })



miya.sendGroupV4Invite = async(jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) => {
let msg = proto.Message.fromObject({
groupInviteMessage: proto.Message.GroupInviteMessage.fromObject({
inviteCode,
inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
groupJid: jid,
groupName: groupName ? groupName : await miya.getName(jid),
caption
})
})
let message = generateWAMessageFromContent(participant, msg, {userJid: miya.decodeJid(miya.user.id), ephemeralExpiration: 3 * 24 * 60 * 60, ...options})
await miya.relayMessage(participant, message.message, {messageId: message.key.id})
return message
}


miya.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
let mime = "";
try {
// Fetch first few bytes to determine MIME type
let res = await axios.get(url, {
headers: {
Range: "bytes=0-512" // Fetch only first 512 bytes
}
});

mime = res.headers["content-type"];

if (mime.split("/")[1] === "gif") {
return miya.sendMessage(jid, {
video: await getBuffer(url),
caption: caption,
gifPlayback: true,
...options,
}, { quoted });
}

let type = mime.split("/")[0] + "Message";

if (mime === "application/pdf") {
return miya.sendMessage(jid, {
document: await getBuffer(url),
mimetype: "application/pdf",
caption: caption,
...options,
}, { quoted });
}

if (mime.split("/")[0] === "image") {
return miya.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted });
}

if (mime.split("/")[0] === "video" || mime.split("/")[1] === "octet-stream") {
return miya.sendMessage(jid, {
video: await getBuffer(url),
caption: caption,
mimetype: "video/mp4",
...options,
}, { quoted });
}

if (mime.split("/")[0] === "audio") {
return miya.sendMessage(jid, {
audio: await getBuffer(url),
caption: caption,
mimetype: "audio/mpeg",
...options,
}, { quoted });
}

console.error("Unsupported MIME type: ", mime);
} catch (err) {
console.error("Failed to fetch file or determine MIME type: ", err);
}
}



miya.sendContactArray = async (jid, data, quoted, options) => {
let contacts = [];

for (let [number, name, org, note] of data) {
number = number.replace(/[^0-9]/g, ''); // Remove non-numeric characters from number

let contextInfo = {
externalAdReply: {
showAdAttribution: true,
mediaType: 1,
title: 'SatzzDev.',
sourceUrl: global.link,
renderLargerThumbnail: true,
thumbnailUrl: 'https://i.pinimg.com/originals/6b/45/3a/6b453a1ed9673d56e34673b281ede225.jpg',
}
};

// Customize your vCard with organization and note fields
let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
ORG:${org || ''}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${note ? note.replace(/\n/g, '\\n') : ''}
END:VCARD`.trim();

contacts.push({ contextInfo, vcard, displayName: name });
}

let displayName = (contacts.length > 1 ? `2013 kontak` : contacts[0].displayName) || null;

return await miya.sendMessage(jid, {
contacts: {
displayName,
contacts,
}
}, {
quoted,
...options
});
}







miya.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)}
await miya.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}





miya.sendSticker = (teks) => {
miya.sendMessage(m.chat, {sticker: {url: teks}},{quoted: m})
}






miya.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)}
await miya.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer}






miya.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}






miya.cMod = (jid, copy, text = '', sender = miya.user.id, options = {}) => {
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === miya.user.id
return proto.WebMessageInfo.fromObject(copy)
}



miya.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
let types = await miya.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: global.packname, author: global.packname2, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await miya.sendMessage(jid, { [type]: { url: pathFile }, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)
}


miya.parseMention = async(text) => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}






miya.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
message.message =
message.message &&
message.message.ephemeralMessage &&
message.message.ephemeralMessage.message
? message.message.ephemeralMessage.message
: message.message || undefined;
let mtype = Object.keys(message.message)[0];
if (message.message[mtype]?.viewOnce) message.message[mtype].viewOnce = false
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo}} : {})} : {})
await miya.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}


store.bind(miya.ev)
return miya
}


/**
* Serialize Message
* @param {WAConnection} miya
* @param {Object} m 
* @param {store} store 
*/
exports.smsg = (miya, m, store) => {
if (!m) return m
let M = proto.WebMessageInfo
m = M.fromObject(m)
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us') 
m.sender = miya.decodeJid(m.fromMe && miya.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = miya.decodeJid(m.key.participant) || ''
}
if (!m.message) return
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessageV2' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
try {
m.body = m.mtype === "conversation" ? m.message.conversation : 
m.mtype === "imageMessage" ? m.message.imageMessage.caption : 
m.mtype === "videoMessage" ? m.message.videoMessage.caption : 
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : 
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : 
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : 
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : 
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id || m.text : "";
} catch {
m.body = ""
}
m.args = m.body.trim().split(/ +/).slice(1);
m.query = m.args.join(" ").trim();
m.q = m.query
m.budy = (typeof m.text == 'string' ? m.text : '')
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
if (m.mtype == 'protocolMessage' && m.msg.key) {
if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
m.msg.key.fromMe = miya.decodeJid(m.msg.key.participant) === miya.decodeJid(miya.user.id)
if (!m.msg.key.fromMe && m.msg.key.remoteJid === miya.decodeJid(miya.user.id)) m.msg.key.remoteJid = m.sender
}
if (m.quoted) {
let type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = Object.keys(m.quoted)[0]
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = miya.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === miya.decodeJid(miya.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, miya)
return exports.smsg(miya, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => miya.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => miya.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => miya.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => miya.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = async (teks) => {
miya.sendMessage(m.chat, {text: teks, 
//ai:true,
contextInfo:{ 
mentionedJid: [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + "@s.whatsapp.net") || [m.sender],
externalAdReply: {
title: 'MiyaBot ヾ(≧▽≦*)o',
body: 'Simple WhatsApp Bot', 
thumbnailUrl:'https://sapisz.vercel.app/api/miya',
sourceUrl:'https://instagram.com/krniwnstria', 
mediaUrl: 'https://instagram.com/krniwnstria', 
mediaType: 2,
}}},{ quoted: m })
}

m.react = (emoti) => miya.sendMessage(m.chat, {react: {text: emoti, key: m.key }})

m.copy = () => exports.smsg(miya, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => miya.copyNForward(jid, m, forceForward, options)



miya.appenTextMessage = async(text, chatUpdate) => {
let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid }, {
userJid: miya.user.id,
quoted: m.quoted && m.quoted.fakeObj
})
messages.key.fromMe = areJidsSameUser(m.sender, miya.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushName
if (m.isGroup) messages.participant = m.sender
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: 'append'
}
miya.ev.emit('messages.upsert', msg)
}
try {
miya.pushMessage(m)
if (m.msg && m.mtype == 'protocolMessage') miya.ev.emit('message.delete', m.msg.key)
} catch (e) {
console.error(e)
}
miya.appenEditedMessage = async(text, chatUpdate) => {
let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid || [] }, {userJid: miya.user.id, quoted: m.quoted && m.quoted.fakeObj})
messages.key.fromMe = areJidsSameUser(m.sender, miya.user.id)
messages.key.id = m.key.id
messages.pushName = m.pushName
if (m.isGroup) messages.participant = m.sender
let msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)],
type: 'append'
}
miya.ev.emit('messages.upsert', msg)
}    

return m
}