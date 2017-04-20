import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './card'
import * as LanguageCode from './languageCode'

export const Input = new GraphQLInputObjectType({
  name: `RulingInput`,
  description: `Required fields for a new Ruling object`,
  fields: () => ({
    text:     { type: new GraphQLNonNull(GraphQLString) },
    date:     { type: new GraphQLNonNull(GraphQLString) },
    language: { type: new GraphQLNonNull(GraphQLID) },
    cards:    { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Ruling`,
  description: `A Ruling object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this ruling.`
    },
    text: {
      type: GraphQLString,
      description: `The text of the ruling.`
    },
    date: {
      type: GraphQLString,
      description: `The date this ruling was issued.`
    },
    language: {
      type: LanguageCode.Definition,
      description: `The language code of this ruling.`,
      resolve: (root, { id }) => Models.Ruling
        .forge({ id })
        .fetch({ withRelated: [`language`] })
        .then(model => model.toJSON().language)
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `List of cards that have this ruling.`,
      resolve: (root, { id }) => Models.Ruling
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  getRuling: {
    type: new GraphQLList(Definition),
    description: `Returns a Ruling with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Ruling
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listRulings: {
    type: new GraphQLList(Definition),
    description: `Lists all Rulings.`,
    resolve: (root, { id }) => Models.Ruling
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createRuling: {
    type: Definition,
    description: `Creates a new Ruling`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Ruling
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateRuling: {
    type: Definition,
    description: `Updates an existing Ruling, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Ruling
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteRuling: {
    type: Definition,
    description: `Deletes a Ruling by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Ruling
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
