Object.assign(global, require("../lib/myfunc"));
const axios = require("axios")
const fetch = require("node-fetch") 
const { Handler } = require('../lib/command.js')
const { exec } = require('child_process')
const util = require('util')
const { proto, generateWAMessageContent, generateWAMessageFromContent, prepareWAMessageMedia } = require("baileys")
const cheerio = require("cheerio")
const fs = require('fs')




Handler(async(m, {miya, budy, reply, isOwner, isPremium, qmsg, mime, args, isAdmins, store}) => {
if (m.text.startsWith(">")) {
if (!isOwner) return 
const evalAsync = () => { 
return new Promise(async (resolve, reject) => {
try {
let evaled = /await/i.test(m.text.slice(2)) ? await eval("(async() => { " + m.text.slice(2) + " })()") : await eval(m.text.slice(2));
if (typeof evaled !== "string")
if (typeof evaled !== "string")
evaled = util.inspect(evaled);
resolve(evaled) } catch (err) { reject(err) }})};
evalAsync().then((result) => m.reply(result)).catch((err) => m.reply(String(err)));    

} else if (m.text.startsWith("$")) {
if (!isOwner) return 
m.reply("Executing...");
exec(m.text.slice(2), async (err, stdout) => {
if (err) return m.reply(`${err}`);
if (stdout) return m.reply(stdout);
});     
}
})