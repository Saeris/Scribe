const production = process.env.NODE_ENV === `production` ? true : false

export const invariant = (condition, message) => {
  if (!production) {
    if (message === undefined) throw new Error(`invariant(...): Second argument must be a string.`)
  }
  if (!condition) {
    let error = production
      ? new Error(`An error has occured. For more information please switch to a development build.`)
      : new Error(message)
    error.name = `Invariant Violation`
    throw error
  }
  return true
}
