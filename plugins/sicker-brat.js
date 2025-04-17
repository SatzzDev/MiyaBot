const { Miya } = require("../lib/command") 
const { fetchJson, getBuffer } = require("../lib/myfunc") 
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require('axios')


Miya({
command:'^brat$', 
type:'Sticker', 
limit:true, 
}, async(m, {miya, from, command, text, reply}) => {
if (!text) return reply("*`❌ [ WRONG FORMAT ]`\n _try example:_ .brat serius aku diginiin? gamau digidaw aja😔?")
if (/--img/.test(text)) {
let txt = text.replace("--img", "")
let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(txt)}`, {responseType: 'arraybuffer'})).data;
await miya.sendMessage(m.chat, {image: media},{quoted:m}) 
} else if (/--animated/.test(text)) {
let txt = text.replace("--animated", "").trim().split(" ");
let array = [];
let tmpDirBase = path.resolve(`./tmp/brat_${Date.now()}`);
fs.mkdirSync(tmpDirBase, {recursive: true})
for (let i = 0; i < txt.length; i++) {
let word = txt.slice(0, i + 1).join(" ");
let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`, {responseType: 'arraybuffer'})).data;
let tmpDir = path.resolve(`${tmpDirBase}/brat_${i}.mp4`);
fs.writeFileSync(tmpDir, media);
array.push(tmpDir);
}
let fileTxt = path.resolve(`${tmpDirBase}/Miya.txt`);
let content = "";
for (let i = 0; i < array.length; i++) {
content += `file '${array[i]}'\n`;
content += `duration 0.5\n`;
}
content += `file '${array[array.length - 1]}'\n`;
content += `duration 3\n`;
fs.writeFileSync(fileTxt, content);
let output = path.resolve(`${tmpDirBase}/output.mp4`);
execSync(`ffmpeg -y -f concat -safe 0 -i ${fileTxt} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${output}`);
await miya.sendImageAsSticker(m.chat, fs.readFileSync(output), m, {packname:'Sticker By',author:'Satzz Voldigoad.'})
} else {
await miya.sendImageAsSticker(m.chat, await getBuffer(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`), m, {packname:'Sticker By',author:'Satzz Voldigoad.'})
}
})