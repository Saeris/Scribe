import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { queries, mutations } from './types'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: `The root query handler for Scribe's GraphQL interface.`,
    fields: () => { return Object.assign({}, ...queries()) }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: `The root query for implementing GraphQL mutations.`,
    fields: () => { return Object.assign({}, ...mutations()) }
  })
})
