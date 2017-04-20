import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './card'
import * as LanguageCode from './languageCode'

export const Input = new GraphQLInputObjectType({
  name: `KeywordInput`,
  description: `Required fields for a new Keyword object`,
  fields: () => ({
    name:         { type: new GraphQLNonNull(GraphQLString) },
    reminderText: { type: new GraphQLNonNull(GraphQLString) },
    languageCode: { type: new GraphQLNonNull(GraphQLID) },
    cards:        { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Keyword`,
  description: `A Keyword object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this keyword.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the keyword.`
    },
    reminderText: {
      type: GraphQLString,
      description: `A short description of the keyword ability's rules.`
    },
    languageCode: {
      type: LanguageCode.Definition,
      description: `The language code the reminder text of keyword is localized in.`,
      resolve: (root, { id }) => Models.Keyword
        .forge({ id })
        .fetch({ withRelated: [`LanguageCode`] })
        .then(model => model.toJSON().languageCode)
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, { id }) => Models.Keyword
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  getKeyword: {
    type: new GraphQLList(Definition),
    description: `Returns a Keyword with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Keyword
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listKeywords: {
    type: new GraphQLList(Definition),
    description: `Lists all Keywords.`,
    resolve: (root, { id }) => Models.Keyword
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createKeyword: {
    type: Definition,
    description: `Creates a new Keyword`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Keyword
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateKeyword: {
    type: Definition,
    description: `Updates an existing Keyword, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Keyword
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteKeyword: {
    type: Definition,
    description: `Deletes a Keyword by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Keyword
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
