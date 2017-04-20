import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './card'

export const Input = new GraphQLInputObjectType({
  name: `AbilityTypeInput`,
  description: `Required fields for a new Ability Type object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    cards:       { type: new GraphQLList(GraphQLID) }
  })
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
  getAbilityType: {
    type: new GraphQLList(Definition),
    description: `Returns an Ability Type with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.AbilityType
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listAbilityTypes: {
    type: new GraphQLList(Definition),
    description: `Lists all Ability Types.`,
    resolve: (root, { id }) => Models.AbilityType
      .findAll()
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
