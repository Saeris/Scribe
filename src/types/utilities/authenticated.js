import { Unauthorized, AlreadyAuthenticated } from '../../config/errors.config'

export const isAuthenticated = fn => (parent, args, context, info) => {
  if (context.user) return fn(parent, args, context, info)
  throw new Unauthorized()
}

export const isNotAuthenticated = fn => (parent, args, context, info) => {
  if (!context.user) return fn(parent, args, context, info)
  throw new AlreadyAuthenticated()
}
