export const junction = sqlTable => ({
  sqlTable,
  sqlJoins: [
    (source, through, args) => `${source}.id = ${through}.${source}`,
    (through, target, args) => `${through}.${target} = ${target}.id`
  ]
})
