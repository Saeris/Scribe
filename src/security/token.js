import jwt from 'jsonwebtoken'
import { invariant } from '../utilities'

const SIGNATURE_ALGO = `HS512`
const UNIT_TO_SECONDS = {
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592000
}

export const issueToken = async (viewerId, secret, duration, unit) => {
  invariant(viewerId, `viewerId must be passed to issueAccessToken.`)
  invariant(secret, `secret must be passed to issueAccessToken.`)
  invariant(UNIT_TO_SECONDS[unit], `unit must be passed to issueAccessToken.`)

  return new Promise( resolve => {
    const options = {
      algorithm: SIGNATURE_ALGO,
      expiresIn: duration * UNIT_TO_SECONDS[unit],
      subject: viewerId
    }
    jwt.sign({ }, Buffer.from(secret, `base64`), options, resolve)
  })
}

export const verifyToken = async (accessToken, secret) => {
  return new Promise( (resolve, reject) => {
    jwt.verify(
      accessToken,
      Buffer.from(secret, `base64`),
      { algorithms: [ SIGNATURE_ALGO ] },
      (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(decoded.sub)
        }
      }
    )
  })
}
