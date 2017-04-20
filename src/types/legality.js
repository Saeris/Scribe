import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './format'
import * as Format from './format'

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
  getLegality: {
    type: new GraphQLList(Definition),
    description: `Returns a Legality with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Legality
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listLegalities: {
    type: new GraphQLList(Definition),
    description: `Lists all Legalities.`,
    resolve: (root, { id }) => Models.Legality
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createLegality: {
    type: Definition,
    description: `Creates a new Legality`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Legality
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateLegality: {
    type: Definition,
    description: `Updates an existing Legality, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Legality
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteLegality: {
    type: Definition,
    description: `Deletes a Legality by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Legality
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
