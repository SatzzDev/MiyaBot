require("../config")
const { Miya } = require('../lib/command.js')
const { fetchJson, pickRandom } = require('../lib/myfunc.js')
const axios = require("axios")
const cheerio = require("cheerio")
const https = require('https')


Miya({
command: '^(pinterest|pin)$',
alias: 'pinterest',
limit: true,
desc: 'Pinterest Image',
type: 'Searcher'
}, async (m, { miya, command }) => {
const { reply, q } = m
if (!q) return reply('Masukkan query image!')
let imgs = await pinterest(q)
console.log(imgs)
await miya.albumMessage(m.chat, imgs, m)
})


async function pinterests(query) {
const url = 'https://www.bing.com/images/search';  
const params = {  
q: query,  
form: 'HDRSC3',  
first: 1  
};  
const response = await axios.get(url, {  
params: params,  
headers: {  
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'  
}  
});  
const $ = cheerio.load(response.data);  
const images = $('a.iusc');  
const imageUrls = [];  
images.each((index, element) => {  
const m = $(element).attr('m');  
if (m) {  
try {  
const decodedM = decodeURIComponent(m.replace(/\\u/g, '%u'));  
const data = JSON.parse(decodedM);  
const imageUrl = data.murl;  
if (imageUrl && imageUrl.includes('i.pinimg.com')) {  
imageUrls.push(imageUrl);  
}  
} catch (e) {  
console.error('Gagal memparsing JSON:', e);  
}  
}  
});  
return imageUrls;
}

const agent = new https.Agent({
rejectUnauthorized: true,
maxVersion: 'TLSv1.3',
minVersion: 'TLSv1.2'
});

async function getCookies() {
try {
const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent });
const setCookieHeaders = response.headers['set-cookie'];
if (setCookieHeaders) {
const cookies = setCookieHeaders.map(cookieString => {
const cookieParts = cookieString.split(';');
return cookieParts[0].trim();
});
return cookies.join('; ');
}
return null;
} catch {
return null;
}
}
async function pinterest(query) {
try {
const cookies = await getCookies();
if (!cookies) return [];

const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
const params = {
source_url: `/search/pins/?q=${query}`,
data: JSON.stringify({
options: {
isPrefetch: false,
query: query,
scope: "pins",
no_fetch_context_on_resource: false
},
context: {}
}),
_: Date.now()
};

const headers = {
'accept': 'application/json, text/javascript, /, q=0.01',
'accept-encoding': 'gzip, deflate',
'accept-language': 'en-US,en;q=0.9',
'cookie': cookies,
'dnt': '1',
'referer': 'https://www.pinterest.com/',
'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-model': '""',
'sec-ch-ua-platform': '"Windows"',
'sec-ch-ua-platform-version': '"10.0.0"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-origin',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
'x-app-version': 'c056fb7',
'x-pinterest-appstate': 'active',
'x-pinterest-pws-handler': 'www/[username]/[slug].js',
'x-pinterest-source-url': '/hargr003/cat-pictures/',
'x-requested-with': 'XMLHttpRequest'
};

const { data } = await axios.get(url, { httpsAgent: agent, headers, params });
return data.resource_response.data.results
.filter(v => v.images?.orig)
.map(result => ({
image: {url:result.images.orig.url},
caption: result.grid_title
}));
} catch {
return [];
}
}