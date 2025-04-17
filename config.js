const fs = require("fs").promises;
const chalk = require("chalk");
const moment = require("moment-timezone");
const { pickRandom, getbuffer, reSize, runtime } = require("./lib/myfunc");
moment.tz.setDefault("Asia/Jakarta");








const d = new Date();
const locale = "id";
const gmt = new Date(0).getTime() - new Date("1 January 2021").getTime();
global.weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][Math.floor(((d * 1) + gmt) / 84600000) % 5];
global.week = d.toLocaleDateString(locale, { weekday: "long" });
global.calender = d.toLocaleDateString("id", { day: "numeric", month: "long", year: "numeric" });
global.owner = ["6282170988479", "6281268248904"];
global.dev = "6282170988479@s.whatsapp.net";
global.nomor = "6281268248904"
global.botname = "MiyaBot";
global.packname = `${global.week}, ${global.calender}`;
global.author = "satzzdev.xyz";
global.newsletterName = "MiyaBot";
global.newsletterJid = "120363229748458166@newsletter";
global.version = "1.5.6"
global.prefa = ["", "!", ".", ",", "🐤", "🗿"];
global.footer = "satzzdev.xyz"
global.wm = "Made By";
global.botName = "MiyaBot";
global.sessionName = "session";
global.sp = "⭔";
global.sgc = "https://chat.whatsapp.com/G6W25LQb4ce2i8r4Z0du1q";
global.link = "https://instagram.com/krniwnstria";
global.runtime = runtime(process.uptime())
global.limitawal = {
    premium: 100, 
    free: 30
};


global.mess = {
    success: "> ✅ *Success*",
    wait: "> ⏳ *Mohon tunggu sebentar*... Kami sedang memproses permintaan Anda, harap bersabar ya!",
    premium: "*`[#]`* ```fitur ini cuma buat Pengguna premium kak :(```",
    owner: "> 🧑‍💻 *Fitur ini hanya untuk pemilik bot*... Maaf, Anda tidak memiliki akses ke fitur ini.",
    admin: "> ⚠️ *Anda harus menjadi admin grup* untuk menggunakan fitur ini, karena bot memerlukan hak akses admin.",
    grup: "> 👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
    group: "> 👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
    pc: "> 👥 *Fitur ini hanya tersedia di chat pribadi*... Pastikan Anda berada di chat pribadi untuk mengakses fitur ini.",
    bodmin: "> 🛠️ *Jadikan SiestaBot sebagai admin* grup untuk menggunakan fitur ini. Pastikan Anda memberikan hak admin kepada bot.",
    limit: "> ⚠️ *limit harian anda telah habis, silahkan coba lagi besok/atau bermain game untuk mendapatkan gold dan membeli limit.*",
};

global.reply = {
    sourceUrl: "https://instagram.com/krniwnstria",
    thumbnailUrl: "https://raw.githubusercontent.com/SatganzDevs/PHONK/refs/heads/main/image.png"
};

