import { isObject } from "lodash"
import { invariant, missingArgument } from "./validation"

const inputs = new Map() // eslint-disable-line

export function createInput(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  const typeName = type._typeConfig.name
  if (inputs.has(typeName)) return inputs.get(typeName)
  const input = {
    input: {
      type: new GqlInput({
        name: `${typeName.toLowerCase()}Input`,
        description: `Fields needed to create or update an instance of ${typeName}.`,
        fields: () => Object.entries(type._typeConfig.fields(true))
          .filter(([name, values]) => !!values.input)
          .reduce((hash, [name, values]) => {
            if (!isObject(values.input)) hash[name] = values
            hash[name] = {
              type: values.input?.type || values.type,
              description: values?.description,
              defaultValue: values.input?.defaultValue
            }
            return hash
          }, {})
      }),
      description: `Fields needed to create or update an instance of ${typeName}.`
    }
  }
  inputs.set(typeName, input)
  return input
}
