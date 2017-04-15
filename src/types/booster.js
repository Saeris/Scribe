import { GraphQLID, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `BoosterInput`,
  description: `Required fields for a new Booster object`,
  fields: () => ({
    id: { type: GraphQLID }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Booster`,
  description: `A Booster object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this booster.`
    }
  })
})

export const Queries = {

}

export const Mutations = {

}
