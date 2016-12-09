import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Booster',
  description: 'A Booster object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this booster.`
    }
  })
})

export const Queries = {

}

export const Mutations = {

}
