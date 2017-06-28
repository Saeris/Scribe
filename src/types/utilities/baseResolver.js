import { UnknownError } from '../../config/errors.config'

export const baseResolver = resolver => (parent, args, context, info) => {
  try {
    return resolver(parent, args, context, info)
  } catch (err) {
    throw new UnknownError(err)
  }
}
