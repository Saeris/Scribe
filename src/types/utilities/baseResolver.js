import { UnknownError } from '../../config/errors.config'

export const baseResolver = fn => (parent, args, context, info) => {
  try {
    return fn(parent, args, context, info)
  } catch (err) {
    throw new UnknownError(err)
  }
}
