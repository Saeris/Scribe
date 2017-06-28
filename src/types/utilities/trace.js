import present from 'present'
import moment from 'moment'
import { log } from 'winston'
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const trace = resolver => async (...args) => {
  const start = present()
  const result = await resolver(...args)
  const end = present()
  log(`Resolver took ${duration(end - start)} ms`)
  return result
}
