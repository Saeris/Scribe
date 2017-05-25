import { invariant } from './'
/**
 * Fancy ID generator that creates 20-character string identifiers with the
 * following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs
 *    won't collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters
 *    that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in
 *    the same timestamp, the latter ones will sort after the former ones.
 *    We do this by using the previous random bits but "incrementing" them by 1
 *    (only in the case of a timestamp collision).
 *
 * Source: https://github.com/meldio/meldio/blob/master/src/jsutils/generatePushId.js
 */

export const generatePushID = (function() {
  const PUSH_CHARS = `-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz`
  let   lastPushTime = 0
  const lastRandChars = []

  return () => {
    let now = new Date().getTime()
    const duplicateTime = now === lastPushTime
    lastPushTime = now

    const timeStampChars = new Array(8)
    for (let i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64)
      now = Math.floor(now / 64)
    }
    invariant(now === 0, `We should have converted the entire timestamp.`)

    let id = timeStampChars.join(``)

    if (!duplicateTime) {
      for (let i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64)
      }
    } else {
      let i
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0
      }
      lastRandChars[i]++
    }
    for (let i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i])
    }
    invariant(id.length === 20, `Length should be 20.`)

    return id
  }
}())
