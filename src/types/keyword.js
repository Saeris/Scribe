import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Card, LanguageCode } from './'

export const Input = new GraphQLInputObjectType({
  name: `KeywordInput`,
  description: `Required fields for a new Keyword object`,
  fields: () => ({
    name:         { type: new GraphQLNonNull(GraphQLString) },
    reminderText: { type: GraphQLString },
    languageCode: { type: new GraphQLNonNull(GraphQLID) },
    cards:        { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `KeywordFilter`,
  description: `Queryable fields for Keyword.`,
  fields: () => ({
    name:         { type: new GraphQLList(GraphQLString) },
    reminderText: { type: GraphQLString },
    languageCode: { type: new GraphQLList(GraphQLID) },
    cards:        { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `KeywordFields`,
  description: `Field names for Keyword.`,
  values: {
    name:         { value: `name` },
    reminderText: { value: `reminderText` },
    languageCode: { value: `languageCode` }
  }
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
  keyword: {
    type: new GraphQLList(Definition),
    description: `Returns a Keyword.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`keyword`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createKeyword: {
    type: Definition,
    description: `Creates a new Keyword`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateKeyword: {
    type: Definition,
    description: `Updates an existing Keyword, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteKeyword: {
    type: Definition,
    description: `Deletes a Keyword by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
