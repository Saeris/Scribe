import { Unauthorized, AlreadyAuthenticated } from './errors'
import { curry } from './curry'

export const isAuthenticated = curry((parent, args, context, info) => {
  if (!context.user) return { parent, args, context, info }
  throw new Unauthorized()
})

export const isNotAuthenticated = resolver => (parent, args, context, info) => {
  if (!context.user) return resolver(parent, args, context, info)
  throw new AlreadyAuthenticated()
}
