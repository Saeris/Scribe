import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'

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
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Rarity
      .query(qb => {
        if (!!id) qb.whereIn(`id`, id)
        if (!!filter) {
          for (let field in filter) {
            qb.whereIn(field, filter[field])
          }
        }
        if (!!limit) qb.limit(limit)
        if (!!offset) qb.offset(offset)
        if (!!orderBy) qb.orderBy(...Object.values(orderBy))
      })
      .fetchAll()
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
