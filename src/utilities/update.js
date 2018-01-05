export const update = async ({ _typeConfig }, { id, input }, context) => {
  const model = _typeConfig.sqlTable || _typeConfig.name.toLowerCase()
  try {
    const result = await context[model].update(input, { id })
    info(`Resolved Mutation: update ${model}`)
    return result.toJSON()
  } catch (err) {
    error(`Failed to run Mutation: update ${model}`, err)
    return null
  }
}
