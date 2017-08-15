import jwt from 'jsonwebtoken'
import { pubKey, privateKey, passphrase } from '../../config/server.config'
import { invariant } from '../../utilities'

export const issueToken = async (id, email) => {
  invariant(id, `id must be passed to issueAccessToken.`)
  invariant(email, `email must be passed to issueAccessToken.`)
  return jwt.sign({ id, email }, { privateKey, passphrase }, { algorithm: `RS256`, expiresIn: `1h` })
}

export const verifyToken = async token => {
  invariant(token, `token must be passed to verifyToken.`)
  return jwt.verify(token, pubKey, { algorithms: [`RS256`] })
}
