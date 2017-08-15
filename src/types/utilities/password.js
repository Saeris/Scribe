import bcrypt from 'bcrypt'

const makeSalt = async strength => new Promise( (resolve, reject) => {
  bcrypt.genSalt(strength, (err, salt) => err ? reject(err) : resolve(salt))
})

const makeHash = async (password, salt) => new Promise( (resolve, reject) => {
  bcrypt.hash(password, salt, (err, hash) => err ? reject(err) : resolve(hash))
})

export const hashPassword = async (password, strength) => makeHash(password, makeSalt(strength))

export const validatePassword = async (clearText, hash) => new Promise( (resolve, reject) => {
  bcrypt.compare(clearText, hash, (err, res) => err ? reject(err) : resolve(res))
})
