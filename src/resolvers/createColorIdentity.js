export const createColorIdentity = async ({ _typeConfig }, { input }, { coloridentity, colors }) => {
  const model = _typeConfig.sqlTable || _typeConfig.name.toLowerCase()
  try {
    const { colorIDs, ...rest } = input
    const result = await coloridentity.findOrCreate(rest, rest)
    const { id } = result.toJSON()
    await Promise.all(colorIDs.map(color => colors.findOrCreate({ colorIdentity: id, color })))
    info(`Resolved Mutation: create ${model}`)
    return result.toJSON()
  } catch (err) {
    error(`Failed to run Mutation: create ${model}`, err)
    return null
  }
}
