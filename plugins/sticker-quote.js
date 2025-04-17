require('../config')
const fs = require('fs')
const { Miya } = require('../lib/command.js');
const axios = require('axios')
const { CS, jsonformat,reSize, ucapanWaktu, formatp, clockString, getBuffer, getCases, generateProfilePicture, sleep, fetchJson, runtime, pickRandom, getGroupAdmins, getRandom } = require("../lib/myfunc")

const {uptotelegra} = require('../lib/uploader')


Miya({
command: '^(quotely|quotelyv2|qc)$',
limit: true,
desc: 'quote chat maker',
type: 'Stiker'
}, async (m, {miya, command}) => {
const {q, pushname} = m
let ppuser = await miya.profilePictureUrl(m.sender, "image").catch(_ => "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60")
const name = await miya.getName(m.sender)
let theme = "quotly" === command ? "terang" : "quotlyv2" === command ? "gelap" : "random"
let result = await Quotly(name, ppuser, q, theme);
miya.sendImageAsSticker(m.chat, result, m, {packname,author})
})

async function Quotly(username, avatar, text) {
const json = {
"type": "quote",
  "format": "png",
  "backgroundColor": "#FFFFFF",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": username,
        "photo": {
          "url": avatar
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
try {
const base = "https://quote-generator-green-three.vercel.app"
const res = await axios.post(base, json, {
headers: {
"Content-Type": "application/json"
}
});
return Buffer.from(res.data.data.image, "base64");
} catch (e) {
throw console.error("Quotly Error (Backup):", e), new Error("Error generating quote image");
}
}