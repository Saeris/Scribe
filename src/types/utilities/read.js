import { info, error } from 'winston'
import Models from '../../models'

const read = (parent, args, context, type) => {
  const { id, filter, limit, offset, orderBy } = args
  return Models[`${type}`]
    .query(qb => {
      if (!!id) qb.whereIn(`id`, id)
      if (!!filter) for (let field in filter) qb.whereIn(field, filter[field])
      if (!!limit) qb.limit(limit)
      if (!!offset) qb.offset(offset)
      if (!!orderBy) qb.orderBy(...Object.values(orderBy))
    })
    .fetchAll()
    .then(collection => collection.toJSON())
    .catch(err => error(`Failed to resolve Query: ${type}`, err))
    .finally(info(`Resolved Query: ${type}`, { parent, args, context }))
}

export default read
