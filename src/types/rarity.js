import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `RarityInput`,
  description: `Required fields for a new Rarity object`,
  fields: () => ({
    name:  { type: new GraphQLNonNull(GraphQLString) },
    class: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `RarityFilter`,
  description: `Queryable fields for Rarity.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `RarityFields`,
  description: `Field names for Rarity.`,
  values: {
    name: { value: `name` }
  }
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
  rarity: {
    type: new GraphQLList(Definition),
    description: `Returns a Rarity.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`rarity`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createRarity: {
    type: Definition,
    description: `Creates a new Rarity`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateRarity: {
    type: Definition,
    description: `Updates an existing Rarity, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteRarity: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
