import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Card from './card'

export const Input = new GraphQLInputObjectType({
  name: `AbilityTypeInput`,
  description: `Required fields for a new Ability Type object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    cards:       { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `AbilityTypeFilter`,
  description: `Queryable fields for AbilityType.`,
  fields: () => ({
    name:  { type: new GraphQLList(GraphQLString) },
    cards: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `AbilityTypeFields`,
  description: `Field names for AbilityType.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `AbilityType`,
  description: `An Ability Type object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this ability type.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the ability type.`
    },
    description: {
      type: GraphQLString,
      description: `Description of the ability type.`
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `The cards associated with this abilityType.`,
      resolve: (root, { id }) => Models.AbilityType
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  abilityType: {
    type: new GraphQLList(Definition),
    description: `Returns a AbilityType.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`abilityType`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.AbilityType
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
  createAbilityType: {
    type: Definition,
    description: `Creates a new AbilityType`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.AbilityType
      .findOrCreate(input)
      .then((model) => model.toJSON())
  },
  updateAbilityType: {
    type: Definition,
    description: `Updates an existing AbilityType, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.AbilityType
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteAbilityType: {
    type: Definition,
    description: `Deletes a AbilityType by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.AbilityType
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
