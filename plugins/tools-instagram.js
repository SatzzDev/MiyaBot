const { Miya } = require("../lib/command");
const axios = require('axios')
const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();
ig.state.generateDevice('akuntumballll311');

// Fungsi login Instagram
async function loginInstagram() {
try {
await ig.account.login('akuntumballll311', 'jayayusman');
console.log("Berhasil login ke Instagram.");
} catch (error) {
console.error("Gagal login ke Instagram:", error);
throw new Error("Gagal login ke Instagram. Silakan cek kembali kredensial login.");
}
}

// Fungsi untuk mendapatkan daftar followers dan following
async function getFollowersAndFollowing(username) {
try {
const user = await ig.user.searchExact(username);
const followersFeed = ig.feed.accountFollowers(user.pk);
const followingFeed = ig.feed.accountFollowing(user.pk);

const followers = await followersFeed.items();
const following = await followingFeed.items();

return {
followers: followers.map(user => user.username),
following: following.map(user => user.username)
};
} catch (error) {
console.error("Gagal mendapatkan data followers/following:", error);
throw new Error("Tidak dapat mengambil data followers/following. Coba lagi nanti.");
}
}

// Fungsi untuk menemukan akun yang belum follow-back
function findNonFollowers(followers, following) {
return following.filter(user => !followers.includes(user));
}

async function downloadStories(username) {
try {
const user = await ig.user.searchExact(username);
const storyFeed = ig.feed.userStory(user.pk);
const stories = await storyFeed.items();
if (!stories.length) return 'Tidak ada story yang ditemukan.';
return stories.map(story => {
const videoUrl = story.video_versions?.[0]?.url;
const imageUrl = story.image_versions2?.candidates?.[0]?.url;
if (!videoUrl && !imageUrl) {
console.warn("Story tanpa media ditemukan:", story);
return null;
}
return {
url: videoUrl || imageUrl,
type: videoUrl ? 'video' : 'image'
};
}).filter(Boolean); 
} catch (error) {
console.error("Gagal mendapatkan stories:", error);
throw new Error("Tidak dapat mengambil stories. Coba lagi nanti.");
}
}
async function downloadHighlights(username) {
try {
const user = await ig.user.searchExact(username);
const reelsTrayFeed = await ig.highlights.highlightsTray(user.pk);
const highlights = reelsTrayFeed.tray;

if (!highlights.length) return 'Tidak ada highlight yang ditemukan.';

let highlightItems = [];
for (const highlight of highlights) {
const highlightFeed = ig.feed.reelsMedia({ userIds: [highlight.id] });
const items = await highlightFeed.items();
highlightItems.push(...items.map(item => {
const videoUrl = item.video_versions?.[0]?.url;
const imageUrl = item.image_versions2?.candidates?.[0]?.url;
if (!videoUrl && !imageUrl) {
console.warn("Highlight tanpa media ditemukan:", item);
return null; 
}
return {
title: highlight.title || 'Highlight Tanpa Judul',
url: videoUrl || imageUrl,
type: videoUrl ? 'video' : 'image'
};
}).filter(Boolean)); 
}
return highlightItems;
} catch (error) {
console.error("Gagal mendapatkan highlights:", error);
throw new Error("Tidak dapat mengambil highlights. Coba lagi nanti.");
}
}
async function stalkInstagram(username) {
try {
const user = await ig.user.searchExact(username);
const userInfo = await ig.user.info(user.pk);
return {
username: userInfo.username,
fullName: userInfo.full_name,
bio: userInfo.biography || 'Tidak ada bio.',
bioLinks: userInfo.external_url || 'Tidak ada.',
followers: formatNumber(userInfo.follower_count),
following: formatNumber(userInfo.following_count),
posts: formatNumber(userInfo.media_count),
isPrivate: userInfo.is_private,
profilePic: userInfo.profile_pic_url_hd || userInfo.profile_pic_url,
isVerified: userInfo.is_verified
};
} catch (error) {
console.error("Gagal mendapatkan data profil:", error);
throw new Error("Tidak dapat mengambil data profil. Periksa username atau coba lagi nanti.");
}
}
function formatNumber(num) {
if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'; 
if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; 
if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'; 
return num.toString(); 
}

async function downloadPost(url) {
try {
let shortcode = url.split('/p/')[1]?.split('/')[0] || url.split('/reel/')[1]?.split('/')[0]
if (!shortcode) throw 'URL tidak valid'

let res = await ig.media.info(await ig.media.getMediaIdByShortcode({shortcode}))
const item = res[0]
const media = []

if (item.carousel_media?.length) {
for (let i of item.carousel_media) {
const video = i.video_versions?.[0]?.url
const img = i.image_versions2?.candidates?.[0]?.url
media.push({type: video ? 'video' : 'image', url: video || img})
}
} else {
const video = item.video_versions?.[0]?.url
const img = item.image_versions2?.candidates?.[0]?.url
media.push({type: video ? 'video' : 'image', url: video || img})
}

return media
} catch (e) {
throw 'gagal ambil media: ' + e.toString()
}
}






Miya({
command: '^igdl$',
desc: 'download post atau reels dari IG (harus publik)',
type: 'Downloader'
}, async (m, { miya, text, reply }) => {
if (!text) return reply('masukin link post/reels instagramnya bang')
try {
await reply('sedang login IG...')
await loginInstagram()
let media = await downloadPost(text)
for (let mdata of media) {
if (mdata.type === 'video') {
await miya.sendMessage(m.chat, {video: {url: mdata.url}}, {quoted: m})
} else {
await miya.sendMessage(m.chat, {image: {url: mdata.url}}, {quoted: m})
}
}
} catch (e) {
reply('gagal ambil: ' + e.toString())
}
})





// Command untuk unfollowers
Miya({
command: '^unfollowers$',
desc: 'cek orang yang ga follback akun kamu',
type: 'Alat'
}, async (m, { miya, command, text, reply }) => {
if (!text) return reply(`mana usernamenya? cth: .${command} krniwnstria\n_akunnya harus public ya_`)
try {
await reply('Sedang memeriksa... Mohon tunggu sebentar.');
await loginInstagram();
const { followers, following } = await getFollowersAndFollowing(text);
const nonFollowers = await findNonFollowers(followers, following);
const responseMessage = nonFollowers.length
? `Akun Yang Anda Follow Tetapi Tidak Memfollow Anda:\n${nonFollowers.map(username => `https://instagram.com/${username}`).join('\n')}`
: 'Semua akun sudah follback!';
await miya.sendButtons(m.chat, '', responseMessage, 'NOTE: silahkan cek dulu, karena terkadang bot suka salah', [{ type: 'btn', text: "Ok", id: 'o' }], m);
} catch (error) {
console.log(error)
await reply('wah, gagal nih, mungkin akunya privat, jika iya, ubah dulu ke publik ya, setelah pakai fitur ini bisa dibalikin ke privat lagi');
}
});


Miya({
command: '^igstalk$',
desc: 'cek orang yang ga follback akun kamu',
type: 'Alat'
}, async (m, { miya, command, text, reply }) => {
if (!text) return reply(`mana usernamenya? cth: .${command} krniwnstria`)
try {
await reply('Sedang memeriksa... Mohon tunggu sebentar.');
await loginInstagram();
const { username, fullName, bio, bioLinks, followers, following, posts, isPrivate, profilePic, isVerified } = await stalkInstagram(text);
const responseMessage = `*INSTAGRAM PROFILE*
- *Username:* ${username}
- *FullName:* ${fullName}
- *bio:* ${bio}
- *BioLinks:* ${bioLinks}
- *Followers:* ${followers}
- *Following:* ${following}
- *Private:* ${isPrivate ? 'Iya' : 'Tidak'}
- *Verified:* ${isVerified ? 'Iya' : 'Tidak'}
`;
await miya.sendMessage(m.chat, {image:{url:profilePic}, caption: responseMessage},{quoted:m})
} catch (error) {
console.log(error)
await reply('wah, gagal nih, mungkin akunya privat, jika iya, ubah dulu ke publik ya, setelah pakai fitur ini bisa dibalikin ke privat lagi');
}
});

// Command untuk stories
Miya({
command: '^igstories$',
desc: 'download story dari akun Instagram',
type: 'Alat'
}, async (m, { miya, command, text, reply }) => {
if (!text) return reply(`mana usernamenya? cth: .${command} krniwnstria\n_akun yang ingin diambil storynya harus public ya_`)
try {
await reply('Sedang memproses... Mohon tunggu sebentar.');
await loginInstagram();
const stories = await downloadStories(text);
if (typeof stories === 'string') return reply(stories);
for (const story of stories) {
if (story.type === 'video') {
await miya.sendMessage(m.chat, {
video: { url:  story.url },
caption: `${ story.title || ''}`
},{quoted:m});
} else {
await miya.sendMessage(m.chat, {
image: { url:  story.url },
caption: `${ story.title || ''}`
},{quoted:m});
}
}
} catch (error) {
console.log(error)
await reply('wah, gagal nih, mungkin akunya privat, jika iya, ubah dulu ke publik ya, setelah pakai fitur ini bisa dibalikin ke privat lagi');
}
});

// Command untuk highlights
Miya({
command: '^ighighlights$',
desc: 'download highlight dari akun Instagram',
type: 'Alat'
}, async (m, { miya, command, text, reply }) => {
if (!text) return reply(`mana usernamenya? cth: .${command} krniwnstria\n_akun yang ingin diambil highlightnya harus public ya_`)
try {
await reply('Sedang memproses... Mohon tunggu sebentar.');
await loginInstagram();
const highlights = await downloadHighlights(text);
if (typeof highlights === 'string') return reply(highlights);
for (const highlight of highlights) {
if (highlight.type === 'video') {
await miya.sendMessage(m.chat, {
video: { url: highlight.url },
caption: `Video Dari Highlight *${highlight.title || ''}*`
},{quoted:m});
} else {
await miya.sendMessage(m.chat, {
image: { url: highlight.url },
caption: `Gambar Dari Highlight *${highlight.title || ''}*`
},{quoted:m});
}
}
} catch (error) {
console.log(error)
await reply('wah, gagal nih, mungkin akunya privat, jika iya, ubah dulu ke publik ya, setelah pakai fitur ini bisa dibalikin ke privat lagi');
}
});