const { createCanvas, loadImage, registerFont } = require('canvas')

const profile = async (username, avatarBuffer, isPremium = false, isOwner = false) => {
registerFont('lib/THEBOLDFONT-FREEVERSION.ttf', { family: 'Bold' })
const canvas = createCanvas(1280, 480)
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#1D1D1D'
ctx.fillRect(0, 0, canvas.width, canvas.height)
const borderColor = isOwner ? '#FFC107' : isPremium ? '#FFC107' : '#C0C0C0'
const buttonColor = isOwner ? '#FFC107' : isPremium ? '#FFC107' : '#C0C0C0'
const textColor = isOwner || isPremium ? '#000000' : '#FFFFFF'
if (isOwner) {
const crown = await loadImage('https://raw.githubusercontent.com/SatzzDev/IDK/main/routes/assets/images/crown.png')
ctx.drawImage(crown, 190, 10, 100, 100)
}
ctx.strokeStyle = borderColor
ctx.lineWidth = 8
ctx.beginPath()
ctx.arc(240, 240, 125, 0, Math.PI * 2)
ctx.stroke()
const avatar = await loadImage(avatarBuffer)
ctx.save()
ctx.beginPath()
ctx.arc(240, 240, 120, 0, Math.PI * 2)
ctx.closePath()
ctx.clip()
ctx.drawImage(avatar, 120, 120, 240, 240)
ctx.restore()
ctx.font = '50px Bold'
ctx.fillStyle = '#FFFFFF'
ctx.textAlign = 'center'
ctx.fillText(username.toUpperCase(), 700, 260)
const textWidth = ctx.measureText(username.toUpperCase()).width
ctx.strokeStyle = borderColor
ctx.lineWidth = 4
ctx.beginPath()
ctx.moveTo(700 - textWidth / 2, 270)
ctx.lineTo(700 + textWidth / 2, 270)
ctx.stroke()
if (isPremium || isOwner) {
const verified = await loadImage('https://raw.githubusercontent.com/SatzzDev/IDK/main/routes/assets/images/verify.png')
const logoX = 700 + textWidth / 2 + 10
const logoY = 260 - 40
ctx.drawImage(verified, logoX, logoY, 50, 50)
}
const buttonWidth = 220
const buttonHeight = 60
const buttonX = 130
const buttonY = 400
ctx.fillStyle = buttonColor
ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)
ctx.font = '30px Bold'
ctx.fillStyle = textColor
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillText(isOwner ? 'OWNER' : isPremium ? 'PREMIUM' : 'FREE', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2)
ctx.strokeStyle = borderColor
ctx.lineWidth = 4
ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight)
ctx.globalAlpha = 0.3
ctx.font = '20px Bold'
ctx.fillStyle = '#A0A0A0'
ctx.fillText('Created By SatzzDev', 1170, 465)
ctx.globalAlpha = 1
return canvas.toBuffer('image/png')
}

const Welcome = async (username, avatarBuffer, serverName) => {
try {
registerFont('lib/THEBOLDFONT-FREEVERSION.ttf', { family: 'Bold' })
//const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' })
//const avatarBuffer = Buffer.from(response.data, 'binary')
const canvas = createCanvas(1920, 768)
const ctx = canvas.getContext('2d')
const bg = await loadImage('https://files.catbox.moe/rwoe9n.png')
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
const avatar = await loadImage(avatarBuffer)
ctx.save()
ctx.beginPath()
ctx.arc(970, 260, 100, 0, Math.PI * 2) 
ctx.closePath()
ctx.clip()
ctx.drawImage(avatar, 870, 160, 200, 200) 
ctx.restore()
ctx.font = '60px Bold'
ctx.fillStyle = '#FFFFFF'
ctx.textAlign = 'center'
ctx.fillText(username.toUpperCase(), 960, 550) 
ctx.font = '40px Bold'
ctx.fillStyle = '#C0C0C0'
ctx.fillText(`Welcome to ${serverName}`, 960, 640) 
return canvas.toBuffer('image/png')
} catch (error) {
console.error('Gagal membuat gambar:', error.message)
}
}
const Goodbye = async (username, avatarBuffer, serverName) => {
try {
registerFont('lib/THEBOLDFONT-FREEVERSION.ttf', { family: 'Bold' })
//const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' })
//const avatarBuffer = Buffer.from(response.data, 'binary')
const canvas = createCanvas(1920, 768)
const ctx = canvas.getContext('2d')
const bg = await loadImage('https://files.catbox.moe/rwoe9n.png')
ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
const avatar = await loadImage(avatarBuffer)
ctx.save()
ctx.beginPath()
ctx.arc(970, 260, 100, 0, Math.PI * 2) 
ctx.closePath()
ctx.clip()
ctx.drawImage(avatar, 870, 160, 200, 200) 
ctx.restore()
ctx.font = '60px Bold'
ctx.fillStyle = '#FFFFFF'
ctx.textAlign = 'center'
ctx.fillText(username.toUpperCase(), 960, 550) 
ctx.font = '40px Bold'
ctx.fillStyle = '#C0C0C0'
ctx.fillText(`Goodbye from ${serverName}`, 960, 640) 
return canvas.toBuffer('image/png')
} catch (error) {
console.error('Gagal membuat gambar:', error.message)
}
}

module.exports = { profile, Welcome, Goodbye }
