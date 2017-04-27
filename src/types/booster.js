import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
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
  getBooster: {
    type: new GraphQLList(Definition),
    description: `Returns a Booster with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Booster
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listBoosters: {
    type: new GraphQLList(Definition),
    description: `Lists all Boosters.`,
    resolve: (root, { id }) => Models.Booster
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {

}
