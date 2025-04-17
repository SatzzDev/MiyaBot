const { Miya, Handler } = require('../lib/command.js');
const { fetchJson } = require('../lib/myfunc');
const fs = require("fs");
const axios = require('axios');


let sessions = {} 

Handler(async (m, { miya, user, budy, isPremium, react, mime, qmsg, reply, freply }) => {
if (!budy.startsWith('.') && /miya/i.test(budy)) {
let userId = m.sender
if (!sessions[userId]) sessions[userId] = [] 
sessions[userId].push({ role: "user", parts: [{ text: budy }] }) 
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyAobbUUggorIsYzVkp9Dt26ud0CvghVFPU`;
const data = {
contents: sessions[userId],
systemInstruction: {
role: "user",
parts: [{ text: `Kamu adalah MiyaBot, Bot WhatsApp AI. Jawablah dengan singkat, padat, dan jelas. Lawan bicaramu adalah ${m.pushName}. Kamu memiliki sifat dingin. Owner-mu adalah SatzzDev.` }]
}
};

axios.post(url, data, { headers: { 'Content-Type': 'application/json' } }).then(response => {
let replyText = response.data.candidates[0].content.parts[0].text 
sessions[userId].push({ role: "assistant", parts: [{ text: replyText }] }) 
m.reply(replyText)
}).catch(error => {
console.error('Error:', error)
})
}
})

Miya({
  command: '^ai$',
  alias: 'ai',
  desc: 'AI chatbot.',
  type: 'Alat'
}, async (m, { miya, command, text }) => {
if (!text) {
return m.reply(`Harap ajukan pertanyaan setelah '${command}' command.\nContoh: '.${command} siapa penemu JavaScript?'`);
}
await miya.sendPresenceUpdate("composing", m.chat);
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyAobbUUggorIsYzVkp9Dt26ud0CvghVFPU`;
const data = {
contents: [
{
role: "user",
parts: [
{
text: text
}
]
}
],
systemInstruction: {
role: "user",
parts: [{
text: `Kamu adalah MiyaBot, Bot WhatsApp AI. Jawablah dengan singkat, padat, dan jelas. Lawan bicaramu adalah ${m.pushName}. Kamu memiliki sifat dingin. Owner-mu adalah SatzzDev.`,
}]
}
};
axios.post(url, data, {
headers: {
'Content-Type': 'application/json'
}
}).then(response => {
m.reply(response.data.candidates[0].content.parts[0].text);
}).catch(error => {
console.error('Error:', error);
});
});