import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql'
import Sort from './sort'

const order = (name, fields) => new GraphQLInputObjectType({
  name: `${name}OrderBy`,
  fields: () => ({
    order: { type: new GraphQLNonNull(fields) },
    sort: { type: Sort }
  })
})

export default order
