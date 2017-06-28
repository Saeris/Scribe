import Dataloader from 'dataloader'
import { curry } from '../../utilities'

export const loadRelated = curry((srcId, type, field) => {
  const getRelated = ids => type
    .collection(ids.map(id => ({ id }) ))
    .load(field)
    .call(`toJSON`)
    .mapSeries(model => model[field])
  return new Dataloader(getRelated).load(srcId)
})
