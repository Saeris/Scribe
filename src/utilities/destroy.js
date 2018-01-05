export const destroy = async ({ _typeConfig }, { id }, context) => {
  const model = _typeConfig.sqlTable || _typeConfig.name.toLowerCase()
  try {
    const result = await context[model].destroy({ id })
    info(`Resolved Mutation: destroy ${model}`, result)
    return id
  } catch (err) {
    error(`Failed to run Mutation: destroy ${model}`, err)
    return null
  }
}
