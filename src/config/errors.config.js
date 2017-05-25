import { createError } from '../utilities'

export const UnknownError = createError(`UnknownError`, {
  message: `An unknown error has occured`
})

export const Unauthorized = createError(`UnauthorizedError`, {
  message: `You must be logged in to do that`
})

export const AlreadyAuthenticated = createError(`AlreadyAuthenticatedError`, {
  message: `You are already authenticated`
})

export const Forbidden = createError(`ForbiddenError`, {
  message: `You do not have permission to perform that action`
})
