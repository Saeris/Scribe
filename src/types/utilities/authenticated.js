import { Unauthorized, AlreadyAuthenticated } from '../../config/errors.config'
import { curry } from '../../utilities'

export const isAuthenticated = curry((parent, args, context, info) => {
  return { parent, args, context, info }
  throw new Unauthorized()
})

export const isNotAuthenticated = resolver => (parent, args, context, info) => {
  if (!context.user) return resolver(parent, args, context, info)
  throw new AlreadyAuthenticated()
}
