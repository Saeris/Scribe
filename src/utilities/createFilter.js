import { isObject } from "lodash"
import { invariant, missingArgument } from "./validation"

const Combination = new GqlEnum({
  name: `Combination`,
  values: {
    AND: {},
    OR: {}
  }
})

const filters = new Map() // eslint-disable-line

export function createFilter(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  const typeName = type._typeConfig.name
  if (filters.has(typeName)) return filters.get(typeName)
  const Condition = new GqlInput({
    name: `${typeName.toLowerCase()}FilterValues`,
    description: `Fields by which ${typeName} can be filtered.`,
    fields: () => Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.filter)
      .reduce((hash, [name, values]) => {
        hash[name] = values.filter
        return hash
      }, {})
  })
  const filter = {
    filter: {
      type: new GqlInput({
        name: `${typeName.toLowerCase()}Filter`,
        description: `Used to filter ${typeName} results.`,
        fields: () => ({
          conditions: {
            type: new GqlList(new GqlNonNull(Condition)),
            description: `A list of conditions by which to filter.`
          },
          combination: {
            type: Combination,
            description: `Operator by which to combine conditions.`,
            defaultValue: `AND`
          }
        })
      }),
      description: `Filters the results by a set of conditions.`
    }
  }
  filters.set(typeName, filter)
  return filter
}
