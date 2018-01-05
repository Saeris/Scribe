import sqlString from "sqlstring"
import database from "@/database"

// Taken from join-monster documentation
// http://join-monster.readthedocs.io/en/latest/relay/
export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, context, resolveInfo) => {
    const { type, id } = fromGlobalId(globalId)

    return joinMonster.getNode(
      type,
      resolveInfo,
      context,
      table => sqlString.escape(`{table}.id = ${id}`),
      sql => database.raw(sql)
    )
  },
  obj => obj.__type__
)
