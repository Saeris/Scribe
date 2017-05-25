import { GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Card, Format } from './'

export const Input = new GraphQLInputObjectType({
  name: `LegalityInput`,
  description: `Required fields for a new Legality object`,
  fields: () => ({
    cards:      { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    format:     { type: new GraphQLNonNull(GraphQLID) },
    legal:      { type: new GraphQLNonNull(GraphQLBoolean) },
    restricted: { type: new GraphQLNonNull(GraphQLBoolean) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `LegalityFilter`,
  description: `Queryable fields for Legality.`,
  fields: () => ({
    cards:      { type: new GraphQLList(GraphQLID) },
    format:     { type: new GraphQLList(GraphQLID) },
    legal:      { type: GraphQLBoolean },
    restricted: { type: GraphQLBoolean }
  })
})

const Fields = new GraphQLEnumType({
  name: `LegalityFields`,
  description: `Field names for Legality.`,
  values: {
    format:     { value: `format` },
    legal:      { value: `legal` },
    restricted: { value: `restricted` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Legality`,
  description: `A Legality object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this name.`
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `The ID of the card.`,
      resolve: (root, { id }) => Models.Legality
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    },
    format: {
      type: Format.Definition,
      description: `The format the card is legal in.`,
      resolve: (root, { id }) => Models.Legality
        .forge({ id })
        .fetch({ withRelated: [`format`] })
        .then(model => model.toJSON().format)
    },
    legal: {
      type: GraphQLBoolean,
      description: `Set to True if the card is Legal to play in the given format.`
    },
    restricted: {
      type: GraphQLBoolean,
      description: `Set to True if the card is restricted in the given format.`
    }
  })
})

export const Queries = {
  legality: {
    type: new GraphQLList(Definition),
    description: `Returns a Legality.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`legality`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createLegality: {
    type: Definition,
    description: `Creates a new Legality`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateLegality: {
    type: Definition,
    description: `Updates an existing Legality, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name)
  },
  deleteLegality: {
    type: Definition,
    description: `Deletes a Legality by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
