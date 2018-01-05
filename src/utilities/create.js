export const create = async ({ _typeConfig }, { input }, context) => {
  const model = _typeConfig.sqlTable || _typeConfig.name.toLowerCase()
  try {
    const result = await context[model].findOrCreate(input, input)
    info(`Resolved Mutation: create ${model}`)
    return result.toJSON()
  } catch (err) {
    error(`Failed to run Mutation: create ${model}`, err)
    return null
  }
}
