import { info, error } from 'winston'
import Models from '../../models'

const create = (parent, { input }, context, type, callback) => Models[`${type}`]
  .findOrCreate(input)
  .then(model => !!callback ? callback(model) : model.toJSON())
  .catch(err => error(`Failed to run Mutation: create${type}`, err))
  .finally(info(`Resolved Mutation: create${type}`, { parent, input, context }))

export default create
