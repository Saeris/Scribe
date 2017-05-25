import Dataloader from 'dataloader'

export const loadRelated = (srcId, type, field) => {
  const getRelated = ids => type
    .collection(ids.map(id => ({ id }) ))
    .load(field)
    .call(`toJSON`)
    .mapSeries(model => model[field])
  return new Dataloader(getRelated).load(srcId)
}
