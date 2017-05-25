import { info, error } from 'winston'
import Models from '../../models'

const update = (parent, { input }, context, type, selection, callback) => {
  if (!!selection && typeof selection === `string`) selection = [`${selection}`]

  const filter = !!selection
    ? Object.keys(input)
        .filter(key => selection.includes(key))
        .reduce((obj, key) => {
          obj[key] = input[key]
          return obj
        }, {})
    : input

  return Models[`${type}`]
    .upsert(filter, input)
    .then(model => !!callback ? callback(model) : model.toJSON())
    .catch(err => error(`Failed to run Mutation: update${type}`, err))
    .finally(info(`Resolved Mutation: update${type}`, { parent, input, context, selection }))
}

export default update
