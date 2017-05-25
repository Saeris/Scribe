import {
  invariant,
  randomBase10,
  randomBase62,
  validateBoolean,
  validateChoices,
  validateNumeric,
  validateRequired,
  validateString,
  validateViewer,
  validateViewerId
} from '../utilities'
import { isPasswordValid, hashPassword } from './password'
import { rootViewerDirectives } from '../schema/analyzer'
import { throwOnErrors, mergeResults } from '../mutations'

const addAuthProviderFailedError = context => ({
  context,
  results: [ `Failed to add authentication provider.` ]
})

export class SecurityApi {
  constructor(context) {
    const { schema, auth, mutation, passwordHashStrength } = context

    invariant(context && typeof context === `object`, `Must pass context to SecurityApi.`)
    invariant(schema, `Must pass schema to SecurityApi context.`)
    invariant(auth, `Must pass auth resolvers to SecurityApi context.`)
    invariant(mutation, `Must pass mutation object to SecurityApi context.`)
    invariant(passwordHashStrength, `Must pass passwordHashStrength to SecurityApi context.`)

    this.schema = schema
    this.auth = auth
    this.mutation = mutation
    this.passwordHashStrength = passwordHashStrength
  }

  viewerTypeName = rootViewerDirectives(schema).map(directive => directive.parentTypeName)[0]

  mkContext = (func, parameter) => ({
    mutation,
    function: func,
    parameter,
    viewerType: viewerTypeName,
    choices: [ `facebook`, `google`, `github` ]
  })

  getOAuthAccessToken = async (viewerId, provider) => {
    const ctx = this.mkContext.bind(null, `security.getOAuthAccessToken`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateViewerId(ctx(), viewerId),
      validateChoices(ctx(`provider`), provider)
    ))

    const authProvider = await auth.getAuthProvider({ viewerId, provider })
    if (!authProvider || !authProvider.accessToken) return null
    return authProvider.accessToken
  }

  removeOAuthProvider = async (viewerId, provider) => {
    const ctx = mkContext.bind(null, `security.removeOAuthProvider`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateViewerId(ctx(), viewerId),
      validateChoices(ctx(`provider`), provider)
    ))

    const deletedCount = await auth.deleteAuthProviders({ viewerId, provider })
    return deletedCount !== 0
  }


  createPasswordAuth = async (viewerId, loginId, password) => {
    const ctx = mkContext.bind(null, `security.createPasswordAuth`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateViewerId(ctx(), viewerId),
      validateRequired(ctx(`loginId`), loginId),
      validateString(ctx(`loginId`), loginId),
      validateRequired(ctx(`password`), password),
      validateString(ctx(`password`), password)
    ))

    const hash = await hashPassword(password, passwordHashStrength)
    const isAdded = await auth.addAuthProvider({
      viewerId,
      provider: `password`,
      providerId: loginId,
      password: hash
    })

    if (!isAdded) throwOnErrors(addAuthProviderFailedError(ctx()))
    return true
  }

  changePasswordAuth = async (viewerId, newLoginId) => {
    const ctx = mkContext.bind(null, `security.changePasswordAuth`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateViewerId(ctx(), viewerId),
      validateRequired(ctx(`newLoginId`), newLoginId),
      validateString(ctx(`newLoginId`), newLoginId),
    ))
    return auth.updateAuthProvider({ viewerId, provider: `password` }, { providerId: newLoginId })
  }

  removePasswordAuth = async (viewerId) => {
    const ctx = mkContext.bind(null, `security.removePasswordAuth`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateViewerId(ctx(), viewerId),
    ))
    const deletedCount = await auth.deleteAuthProviders({
      viewerId,
      provider: `password`
    })
    return deletedCount !== 0
  }

  createPasswordResetToken = async (loginId, length, numeric = false) => {
    const ctx = mkContext.bind(null, `security.createPasswordResetToken`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateRequired(ctx(`loginId`), loginId),
      validateString(ctx(`loginId`), loginId),
      validateRequired(ctx(`length`), length),
      validateNumeric(ctx(`length`), length),
      validateRequired(ctx(`numeric`), numeric),
      validateBoolean(ctx(`numeric`), numeric)
    ))
    const passwordToken = await this.createRandomToken(length, numeric)

    const newHash = await hashPassword(passwordToken, passwordHashStrength)

    const isUpdated = await auth.updateAuthProvider(
      { provider: `password`, providerId: loginId },
      { passwordToken: newHash })

    if (!isUpdated) return null

    return passwordToken
  }

  changePassword = async (loginId, passwordOrToken, newPassword) => {
    const ctx = mkContext.bind(null, `security.changePassword`)
    throwOnErrors(mergeResults(
      validateViewer(ctx(), viewerTypeName),
      validateRequired(ctx(`loginId`), loginId),
      validateString(ctx(`loginId`), loginId),
      validateRequired(ctx(`passwordOrToken`), passwordOrToken),
      validateString(ctx(`passwordOrToken`), passwordOrToken),
      validateRequired(ctx(`newPassword`), newPassword),
      validateString(ctx(`newPassword`), newPassword)
    ))
    const provider = await auth.getAuthProvider({
      provider: `password`,
      providerId: loginId
    })
    if (!provider) return false
    const passwordHash = provider.password
    const passwordTokenHash = provider.passwordToken
    if (!passwordHash) return false
    const isPassword = await isPasswordValid(passwordOrToken, passwordHash)
    const isToken = passwordTokenHash &&
      await isPasswordValid(passwordOrToken, passwordTokenHash)
    if (!isPassword && !isToken) return false
    const newPasswordHash =
      await hashPassword(newPassword, passwordHashStrength)
    return auth.updateAuthProvider({ provider: `password`, providerId: loginId }, { password: newPasswordHash, passwordToken: null })
  }

  createRandomToken = async (length, numeric = false) => {
    const ctx = mkContext.bind(null, `security.createRandomToken`)
    throwOnErrors(mergeResults(
      validateRequired(ctx(`length`), length),
      validateNumeric(ctx(`length`), length),
      validateRequired(ctx(`numeric`), numeric),
      validateBoolean(ctx(`numeric`), numeric),
    ))

    if (numeric) return randomBase10(length)
    return randomBase62(length)
  }
}
