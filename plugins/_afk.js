const {Handler} = require('../lib/command')
const {ftxt, ttle} = require('../lib/scrapes')
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

Handler(async (m, { miya, user, budy, reply }) => {
if (m.isGroup) {
let mentionUser = [...new Set([...(m.mentionedJid || []),...(m.quoted ? [m.quoted.sender] : []),]),];
for (let jid of mentionUser) {
let user = global.db.data.users[jid];
if (!user) continue;
let afkTime = user.afkTime;
if (!afkTime || afkTime < 0) continue;
let reason = user.afkReason || "";
m.reply(`Jangan tag dia! dia sedang AFK${reason ? " dengan alasan: " + reason : ""}\nSelama ${CS(new Date() - afkTime)}`);
}
if (db.data.users[m.sender].afkTime > -1) {
let user = global.db.data.users[m.sender];
m.reply(`@${m.sender.split("@")[0]} telah kembali dari AFK${user.afkReason ? " setelah: " + user.afkReason : ""}\nSelama ${CS(new Date() - user.afkTime)}`);
user.afkTime = -1;
user.afkReason = "";
}
}
});