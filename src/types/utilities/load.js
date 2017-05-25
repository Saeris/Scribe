import Dataloader from 'dataloader' //eslint-disable-line

export const load = (id, type) => type.findById(id).then(model => model.toJSON())
