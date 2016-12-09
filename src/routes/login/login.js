import jwt from 'jsonwebtoken'
import passport from 'passport'
import BearerStrategy from 'passport-http-bearer'

export default class Login {
  payload = {

  }

  secret = process.env.JWT_PRIVATE_KEY

  options = {
    algorithm: 'RS256',
    expiresIn: "2h"
  }

  constructor() {
    passport.use(new BearerStrategy((token, cb) => {
      db.users.findByToken(token, (err, user) => {
        if (err) return cb(err)
        if (!user) return cb(null, false)
        return cb(null, user)
      })
    }))
    console.log(`✓ Passport configured with Bearer Strategy`)
  }

  list(req, res) {
    res.send('Login')
  }

  createToken(user) {
    return jwt.sign(this.payload, this.secret, this.options)
  }
}
