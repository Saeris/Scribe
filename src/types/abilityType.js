import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Card } from './'

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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createAbilityType: {
    type: Definition,
    description: `Creates a new AbilityType`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateAbilityType: {
    type: Definition,
    description: `Updates an existing AbilityType, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteAbilityType: {
    type: Definition,
    description: `Deletes a AbilityType by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
