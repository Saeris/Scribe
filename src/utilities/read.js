import database from "@/database"

export const read = async (parent, args, context, resolveInfo) => {
  const query = resolveInfo?.operation?.name?.value
  try {
    const result = await joinMonster(resolveInfo, context, sql => database.raw(sql))
    info(`Resolved query: ${query} `)
    return result
  } catch (err) {
    error(`Failed to run query: ${query} `, err)
    return null
  }
}
