import { info, error } from 'winston'
import Models from '../../models'

export const destroy = (parent, { id }, context, type) => Models[`${type}`]
  .destroy({ id })
  .then(model => model.toJSON())
  .catch(err => error(`Failed to run Mutation: destroy${type}`, err))
  .finally(info(`Resolved Mutation: destroy${type}`, { parent, id, context }))
