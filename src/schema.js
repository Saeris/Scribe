import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import * as Types from './types'

export default new GraphQLSchema({
  types:  Object.values(Types).filter(type => !!type.Definition).map(type => type.Definition ),
  query: new GraphQLObjectType({
    name: `Query`,
    description: `The root query handler for Scribe's GraphQL interface.`,
    fields: () => Object.assign({}, ...Object.values(Types).filter(type => !!type.Queries).map(type => type.Queries))
  }),
  mutation: new GraphQLObjectType({
    name: `Mutation`,
    description: `The root query for implementing GraphQL mutations.`,
    fields: () => Object.assign({}, ...Object.values(Types).filter(type => !!type.Mutations).map(type => type.Mutations))
  })
})
