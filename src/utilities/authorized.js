import { Unauthorized } from './errors'

export const isAuthorized = (resolver, requirements) => (parent, args, context, info) => {
  let hasScope = false

  requirements.forEach(scope => {
    if (context.user.scope.includes(scope)) hasScope = true
  })

  if (hasScope) return resolver(parent, args, context, info)
  throw new Unauthorized()
}
