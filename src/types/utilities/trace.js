import present from 'present'
import moment from 'moment'
import { log } from 'winston'
const duration = ms => moment.utc(ms).format(`HH:mm:ss.SSS`)

export const traceResolve = fn => async (obj, args, context, info) => {
  const start = present()
  const result = await fn(obj, args, context, info)
  const end = present()
  log(`Resolver took ${duration(end - start)} ms`)
  return result
}
