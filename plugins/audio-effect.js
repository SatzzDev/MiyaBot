const { Miya } = require('../lib/command.js');
const fs = require('fs');
const { exec } = require('child_process');
const { getRandom } = require('../lib/myfunc'); // Pastikan getRandom didefinisikan
const mess = { wait: "Tunggu sebentar..." };

Miya({
  command: '^bass$',
  desc: 'Mengubah audio menjadi efek bass',
  alias: 'bass',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-af equalizer=f=54:width_type=o:width=2:g=20");
});

Miya({
  command: '^blown$',
  alias: 'blown',
  desc: 'Mengubah audio menjadi efek blown',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-af acrusher=.1:1:64:0:log");
});

Miya({
  command: '^deep$',
  desc: 'Mengubah audio menjadi efek deep',
  alias: 'deep',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-af atempo=4/4,asetrate=44500*2/3");
});

Miya({
  command: '^earrape$',
  alias: 'earrape',
  desc: 'Mengubah audio menjadi efek earrape',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-af volume=12");
});

Miya({
  command: '^fast$',
  alias: 'fast',
  desc: 'Mengubah audio menjadi cepat',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, '-filter:a "atempo=1.63,asetrate=44100"');
});

Miya({
  command: '^nightcore$',
  desc: 'Mengubah audio menjadi efek nightcore',
  alias: 'nightcore',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-filter:a atempo=1.25,asetrate=44100*1.25");
});

Miya({
  command: '^speedup$',
  alias: 'speedup',
  desc: 'Mengubah audio menjadi lebih cepat',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, "-filter:a atempo=1.2 -c:a libmp3lame -b:a 192k");
});

Miya({
  command: '^reverb$',
  alias: 'reverb',
  desc: 'Mengubah audio menjadi efek reverb',
  limit: true,
  type: 'Audio Effect',
}, async (m, { miya, mime, qmsg }) => {
  await applyAudioAudioEffect(m, miya, mime, qmsg, '-af "aecho=0.8:0.88:60:0.4"');
});
/**
 * Fungsi untuk mengaplikasikan efek audio.
 * @param {Object} m Pesan WhatsApp.
 * @param {Object} miya Koneksi WhatsApp bot.
 * @param {String} mime Tipe MIME dari file media.
 * @param {Object} qmsg Pesan yang dikutip.
 * @param {String} set Efek filter FFmpeg.
 */
async function applyAudioAudioEffect(m, miya, mime, qmsg, set) {
  try {
      await m.reply(mess.wait);
      let media = await miya.downloadAndSaveMediaMessage(qmsg);
      let output = getRandom(".mp3");
      exec(`ffmpeg -i ${media} ${set} ${output}`, (err) => {
        fs.unlinkSync(media);
        if (err) return m.reply(`Error: ${err.message}`);
        let buff = fs.readFileSync(output);
        miya.sendMessage(
          m.chat,
          { audio: buff, mimetype: "audio/mpeg" },
          { quoted: m }
        );
        fs.unlinkSync(output);
      });
  } catch (e) {
    m.reply(`Error: ${e.message}`);
  }
}
