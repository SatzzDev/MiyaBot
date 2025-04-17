const { Miya } = require('../lib/command');
const axios = require('axios');

async function vxtwitter(url) {
    if (/x.com/.test(url)) {
        url = url.replace("x.com", "twitter.com");
    }
    let { data } = await axios.get(url.replace("twitter.com", "api.vxtwitter.com")).catch(e => e.response);
    return {
        metadata: {
            title: data.text,
            id: data.tweetID,
            likes: data.likes.toLocaleString(),
            replies: data.replies.toLocaleString(),
            retweets: data.retweets.toLocaleString(),
            uploaded: new Date(data.date).toLocaleString(),
            author: data.user_name
        },
        downloads: data.media_extended.map((a) => ({
            mimetype: a.type === "image" ? "image/jpg" : "video/mp4",
            url: a.url
        }))
    };
}

Miya({
    command: '^xdl$',
    type: 'Downloader',
    limit: true
}, async (m, { miya, reply }) => {
const text = m.text;
if (!text) return reply(`masukan url twitternya!`);
try {
let data = await vxtwitter(text);
for (let i of data.downloads) {
await miya.sendFileUrl(m.chat, i.url, "", m);
}
} catch (error) {
console.error(error);
reply('Terjadi kesalahan saat memproses permintaan. Pastikan URL yang diberikan valid.');
}
});