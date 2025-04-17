const { Miya } = require('../lib/command')
const { cutAudio, cutVideo } = require('../lib/converter')

Miya({
  command: '^cut$',
  type: 'Alat',
  limit: true
}, async (m, { miya, args, reply }) => {
  if (args.length < 2) return reply('Masukkan waktu mulai dan akhir dengan format HH:MM:SS. Contoh: .cut 00:00:30 00:01:00')
  let [startTime, endTime] = args
  let media = await miya.downloadMediaMessage(m.quoted || m)
  if (!media) return reply('Tidak ada media yang ditemukan untuk diproses.')

  let mime = m.quoted.mimetype || ''
  let ext = mime.split('/')[1] || 'mp4'

  if (mime.startsWith('audio/')) {
    try {
      let audioBuffer = await cutAudio(media, ext, startTime, endTime)
      await miya.sendMessage(m.chat, { audio: audioBuffer, ptt: false, mimetype: mime }, { quoted: m })
    } catch (err) {
      console.error(err)
      reply('Terjadi kesalahan saat memotong audio.')
    }
  } else if (mime.startsWith('video/')) {
    try {
      let videoBuffer = await cutVideo(media, ext, startTime, endTime)
      await miya.sendMessage(m.chat, { video: videoBuffer, mimetype: mime }, { quoted: m })
    } catch (err) {
      console.error(err)
      reply('Terjadi kesalahan saat memotong video.')
    }
  } else {
    return reply('Balas audio atau video dengan caption .cut')
  }
})
