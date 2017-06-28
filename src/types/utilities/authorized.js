import { Unauthorized } from '../../config/errors.config'

export const isAuthorized = (resolver, requirements) => (parent, args, context, info) => {
  let hasScope = false

  requirements.map(scope => {
    if (context.user.scope.includes(scope)) hasScope = true
  })

  if (hasScope) return resolver(parent, args, context, info)
  throw new Unauthorized()
}
