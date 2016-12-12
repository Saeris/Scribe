import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { definitions, queries, mutations } from './models'

export default new GraphQLSchema({
  types: [...definitions()],
  query: new GraphQLObjectType({
    name: `Query`,
    description: `The root query handler for Scribe's GraphQL interface.`,
    fields: () => { return Object.assign({}, ...queries()) }
  }),
  mutation: new GraphQLObjectType({
    name: `Mutation`,
    description: `The root query for implementing GraphQL mutations.`,
    fields: () => { return Object.assign({}, ...mutations()) }
  })
})
