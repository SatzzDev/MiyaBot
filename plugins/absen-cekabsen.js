require('../config')
const { Miya } =  require('../lib/command')

// CEK ABSEN
Miya({
command: '^cekabsen$',
alias: 'cekabsen',
desc: 'mengecek absensi',
type: 'Group'
}, async (m, {miya, command}) => {
let id = m.chat
miya.absen = miya.absen ? miya.absen : {}
if (!(id in miya.absen)) return m.reply(`_*Tidak ada absen berlangsung digrup ini!*_\n\n*.mulaiabsen* - untuk memulai absen`)
let d = new Date
let date = d.toLocaleDateString('id', {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let absen = miya.absen[id][1]
let list = absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
m.reply(`*「 ABSEN 」*

Tanggal: ${date}
${miya.absen[id][2]}

┌ *List absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────`)
})

// ABSEN RESPONSE
Miya({
command:'^absen$',
desc: 'absen',
alias: 'absen',
type:'Group'
}, async (m, {miya, command}) => {
let id = m.chat
miya.absen = miya.absen ? miya.absen : {}
if (!(id in miya.absen)) return m.reply(`_*Tidak ada absen berlangsung digrup ini!*_\n\n*.mulaiabsen* - untuk memulai absen`)
let absen = miya.absen[id][1]
const wasVote = absen.includes(m.sender)
if (wasVote) return m.reply('*Kamu sudah absen!*')
absen.push(m.sender)
m.reply(`Done!`)
let d = new Date
let date = d.toLocaleDateString('id', {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let list = absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
m.reply(`*「 ABSEN 」*

Tanggal: ${date}
${miya.absen[id][2]}

┌ *List absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────
`)
})

// MEMULAI ABSEN
Miya({
command: '^mulaiabsen$',
desc: 'memulai absensi',
alias: 'mulaiabsen',
onlyAdmins: true,
type:'Group'
}, async (m, {miya, command}) => {
miya.absen = miya.absen ? miya.absen : {}
let id = m.chat
if (id in miya.absen) {
m.reply(`_*Masih ada absen di chat ini!*_\n\n*.hapusabsen* - untuk menghapus absen`)
}
miya.absen[id] = [
m.reply(`Berhasil memulai absen!\n\n*.absen* - untuk absen\n*.cekabsen* - untuk mengecek absen\n*.hapusabsen* - untuk menghapus data absen`),
[],
m.query
]
})

// HAPUS ABSEN
Miya({
command: '^hapusabsen$',
desc: 'menhapus absensi',
alias: 'hapusabsen',
onlyAdmins:true,
type:'Group'
}, async (m, {miya, command}) => {
let id = m.chat
miya.absen = miya.absen ? miya.absen : {}
if (!(id in miya.absen)) return m.reply(`_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`)
delete miya.absen[id]
m.reply(`Done!`)
})