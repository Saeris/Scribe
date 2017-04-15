import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `RarityInput`,
  description: `Required fields for a new Rarity object`,
  fields: () => ({
    name:  { type: new GraphQLNonNull(GraphQLString) },
    class: { type: new GraphQLNonNull(GraphQLString) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Rarity`,
  description: `A Rarity object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this rarity.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the rarity.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display this rarity.`
    }
  })
})

export const Queries = {
  getRarity: {
    type: new GraphQLList(Definition),
    description: `Returns a Rarity with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Rarity
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listRarities: {
    type: new GraphQLList(Definition),
    description: `Lists all Rarities.`,
    resolve: (root, { id }) => Models.Rarity
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createRarity: {
    type: Definition,
    description: `Creates a new Rarity`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Rarity
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateRarity: {
    type: Definition,
    description: `Updates an existing Rarity, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Rarity
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteRarity: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Rarity
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
