process.on("uncaughtException", console.error);
require("./config");
const moment = require('moment-timezone')
const {
Browsers,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
MessageRetryMap,
makeCacheableSignalKeyStore,
fetchLatestBaileysVersion,
makeInMemoryStore,
getAggregateVotesInPollMessage,
} = require("baileys");
const fs = require("fs");
const pino = require("pino");
const chalk = require("chalk");
const path = require("path");
const readline = require("readline");
const yargs = require("yargs/yargs");
const NodeCache = require("node-cache");
let { handler } = require("./handler.js");
const _ = require("lodash");
const { fetchJson } = require("./lib/myfunc");
const { Socket, smsg } = require("./lib/simple");
const syntaxerror = require("syntax-error");


const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };



var low = require("./lib/lowdb");
const { Low, JSONFile } = low;
global.opts = new Object(
yargs(process.argv.slice(2)).exitProcess(false).parse()
);
global.db = new Low(new JSONFile(`./src/database.json`));
global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ)
return new Promise((resolve) =>
setInterval(function () {
!global.db.READ
? (clearInterval(this),
resolve(
global.db.data == null ? global.loadDatabase() : global.db.data
))
: null;
}, 1 * 1000)
);
if (global.db.data !== null) return;
global.db.READ = true;
await global.db.read();
global.db.READ = false;
global.db.data = {
users: {},
chats: {},
database: {},
settings: {},
others: {},
menfess: {},
response:{},
sticker:{},
level: [],
restart: {},
...(global.db.data || {}),
};
global.db.chain = _.chain(global.db.data);
};
loadDatabase();
if (global.db)

setInterval(async () => {
if (global.db.data) await global.db.write();
}, 30 * 1000);


setInterval(() => {
let directoryPath = path.join();
fs.readdir(directoryPath, async function (err, files) {
var filteredArray = await files.filter((item) => item.endsWith("jpeg") || item.endsWith("gif") || item.endsWith("png") || item.endsWith("mp3") || item.endsWith("mp4") || item.endsWith("jpg") || item.endsWith("webp") || item.endsWith("webm") || item.endsWith("zip"));
if (filteredArray.length > 0) {
console.log(chalk.redBright(`[DETECTED] ${filteredArray.length} trash file`));
setInterval(() => {
if (filteredArray.length == 0)
return console.log(chalk.green(`[SATZZ] no trash file detected.`));
filteredArray.forEach(function (file) {
let sampah = fs.existsSync(file);
if (sampah) fs.unlinkSync(file);
});
}, 15_000);
}
});
}, 30_000);




const ConnectToWhatsApp = async () => {
const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
const { version, isLatest } = await fetchLatestBaileysVersion();
const store = makeInMemoryStore({logger: pino().child({ level: "fatal", stream: "store" }),});
const auth = {creds: state.creds,keys: makeCacheableSignalKeyStore(state.keys,pino().child({ level: "silent", stream: "store" }))};
const msgRetryCounterCache = new NodeCache();
const connectionOptions = {
version,
logger: pino({ level: "silent" }),
printQRInTerminal: false,
mobile: false,
auth,
browser: Browsers.ubuntu("Chrome"), 
getMessage: async key => {
const jid = jidNormalizedUser(key.remoteJid);
const msg = await store.loadMessage(jid, key.id);
return msg?.message || '';
},
shouldSyncHistoryMessage: msg => {
console.log(` ‎ ‎ \x1b[32mMemuat Chat [${msg.progress}%]\x1b[39m`);
return !!msg.syncType;
},
MessageRetryMap,
msgRetryCounterCache,
keepAliveIntervalMs: 20000,
syncFullHistory: true,
defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
keepAliveIntervalMs: 20000,
defaultQueryTimeoutMs: 20000,
connectTimeoutMs: 30000,
fireInitQueries: true,
emitOwnEvents: false,
generateHighQualityLinkPreview: true,
markOnlineOnConnect: true,
};

const miya = Socket(connectionOptions);

setInterval(async () => {
let res = await fetchJson('https://miyabot.up.railway.app/api/winners')
if (!res.length) return 

for (const winner of res) {
let user = db.data.users[winner.phone + '@s.whatsapp.net'] 
if (user) {
user.limit += 1
miya.sendMessage(winner.phone + '@s.whatsapp.net', {text:'Kamu Menang 1 Limit dari Game: ' + winner.game})
} else if (winner.phone.startsWith('08')) {
let user62 = db.data.users['62' + winner.phone.slice(1) + '@s.whatsapp.net']
if (user62) {
user62.limit += 1
miya.sendMessage('62' + winner.phone.slice(1) + '@s.whatsapp.net', {text:'Kamu Menang 1 Limit dari Game: ' + winner.game})
}
}
}

}, 1_000)





setInterval(async () => {
const now = moment().tz('Asia/Jakarta')
const currentTime = now.format('HH:mm')
if (["00:00"].includes(currentTime)) {
for (let i of Object.keys(db.data.users)) {  
if (db.data.users[i].limit < 5) {  
db.data.users[i].limit = 5;  
}  
}  
}
}, 60_000)





if (!miya.authState.creds.registered) {
console.log(chalk.white.bold(" ‎ ‎ - Silakan masukkan nomor WhatsApp Anda, misalnya +628xxxx"));
const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
const code = await miya.requestPairingCode(phoneNumber, 'MIYAABOT');
setTimeout(() => {
console.log(chalk.white.bold(" ‎ ‎ - Kode Pairing Anda: " + code));
}, 3000);
}
store?.bind(miya.ev);

miya.ev.process(async (events) => {

if (events["connection.update"]) {
const update = events["connection.update"];
const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;
if (isNewLogin) miya.isInit = true;
if (connection == "connecting") console.log(chalk.cyan(" ‎ ‎ Connecting..."));
if (connection == "open") { 
console.log(chalk.green(" ‎ ‎ Connected  ✅"));
try {
const bot = db.data.others["restarts"];
if (bot) {
const { key, from } = bot;
await miya.sendMessage(from, {
text: "_bot has been restarted ✅_",
edit: key,
});
delete db.data.others["restarts"];
loadDatabase();
}
} catch (error) {
console.error("Failed to handle post-restart operations:", error);
}
}

if (connection == "close")
console.log(chalk.yellow(" ‎ ‎ connection lost, trying to reconnect..."));
if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
ConnectToWhatsApp();
}
if (db.data == null) await loadDatabase();
}

if (events["creds.update"]) {
await saveCreds();
}

if (events["contacts.upsert"]) {
let update = events["contacts.upsert"];
for (let contact of update) {
let id = jidNormalizedUser(contact.id);
if (store && store.contacts)
store.contacts[id] = {...(store.contacts?.[id] || {}), ...(contact || {}), isContact: true};
}
}

async function getMessage(key) {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id);
return msg;
}
return {
conversation: "SatzzDev",
};
}
    
if (events["messages.upsert"]) {
const chatUpdate = events["messages.upsert"];
if (global.db.data) await global.db.write();
let m =
chatUpdate.messages[0] ||
chatUpdate.messages[chatUpdate.messages.length - 1];
if (!m.message) return;
if (m.key.id.startsWith("BAE5") && m.key.id.length === 16) return;
miya.readMessages([m.key]);
m = await smsg(miya, m, store);
handler(miya, m, chatUpdate, store);
}
if (events["messages.update"]) {
const chatUpdate = events["messages.update"];
for (const { key, update } of chatUpdate) {
if (update.pollUpdates) {
const pollCreation = await getMessage(key);
if (pollCreation) {
let pollUpdate = await getAggregateVotesInPollMessage({
message: pollCreation,
pollUpdates: update.pollUpdates,
});
var toMiya = pollUpdate.filter((v) => v.voters.length !== 0)[0]
?.name;
if (toMiya == undefined) return;
var prefMiya = "." + toMiya;
miya.appenTextMessage(prefMiya, chatUpdate);
}
} else {
}
}
}
if (events.call) {
const celled = events.call;
let botNumber = await miya.decodeJid(miya.user.id);
for (let kopel of celled)
if (!kopel.isGroup && kopel.from !== global.dev) {
await miya.query({tag: "call",attrs: { from: botNumber, to: kopel.from },content: [{tag: "reject",attrs: {"call-id": kopel.id,"call-creator": kopel.from,count: "0"},content: undefined}]});
if (kopel.status === "offer") {
let key = await miya.sendContactArray(kopel.from, [[global.dev,"SatzzDev.","Developer",'It always seems impossible until it\'s done.']], null)
await miya.sendMessage(kopel.from,{text:'*`[ AUTO BLOCK SYSTEM ]`*\n\nYou have been blocked for calling the bot. Contact the owner to unblock.'},{quoted: key});
await miya.updateBlockStatus(kopel.from, "block");
}
}
}
if (events["group-participants.update"]) {
const anu = events["group-participants.update"];
const { memberUpdate } = require("./lib/welcome.js");
memberUpdate(miya, anu);
}
});
return miya;
};

ConnectToWhatsApp();



let pluginFolder = path.join(__dirname, "plugins");
let pluginFilter = (filename) => /\.js$/.test(filename);
plugins = {};
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
try {
plugins[filename] = require(path.join(pluginFolder, filename));
} catch (e) {
delete plugins[filename];
}
}


const reload = (_ev, filename) => {
if (pluginFilter(filename)) {
let dir = path.join(pluginFolder, filename);
if (dir in require.cache) {
delete require.cache[dir];
if (fs.existsSync(dir))
console.log(' ‎ ‎',chalk.blueBright(`re - require plugin '${filename}'`));
else {
console.log(' ‎ ‎',chalk.yellowBright(`deleted plugin '${filename}'`));
return delete plugins[filename];
}
} else console.log(' ‎ ‎',chalk.greenBright(`requiring new plugin '${filename}'`));
let err = syntaxerror(fs.readFileSync(dir), filename);
if (err)
console.log(' ‎ ‎',
chalk.redBright(`syntax error while loading '${filename}'\n${err}`)
);
else
try {
plugins[filename] = require(dir);
} catch (e) {
console.log(' ‎ ‎',
chalk.redBright(`error require plugin '${filename}\n${e}'`)
);
} finally {
plugins = Object.fromEntries(
Object.entries(plugins).sort(([a], [b]) => a.localeCompare(b))
);
}
}
};

fs.watch(path.join(__dirname, "plugins"), reload);