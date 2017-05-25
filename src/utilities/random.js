import crypto from 'crypto'

const { map } = Array.prototype

export const randomBuffer = lengthInBytes => new Promise((resolve, reject) => crypto
  .randomBytes(lengthInBytes, (err, buffer) => err ? reject(err) : resolve(buffer)))

export const randomBase64 = async lengthInBytes => await randomBuffer(lengthInBytes).toString(`base64`)

const bufferToPad = (buffer, pad) => buffer::map(char => pad[char % pad.length]).join(``)

const bufferToBase62 = buffer => bufferToPad(buffer, `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`)

const bufferToBase10 = buffer => bufferToPad(buffer, `0123456789`)

export const randomBase62 = async lengthInChars => bufferToBase62(await randomBuffer(lengthInChars))

export const randomBase10 = async lengthInChars => bufferToBase10(await randomBuffer(lengthInChars))
