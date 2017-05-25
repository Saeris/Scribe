import { GraphQLInputObjectType, GraphQLNonNull } from 'graphql'
import sort from './'

const order = (name, fields) => new GraphQLInputObjectType({
  name: `${name}OrderBy`,
  fields: () => ({
    order: { type: new GraphQLNonNull(fields) },
    sort: { type: sort }
  })
})

export default order
