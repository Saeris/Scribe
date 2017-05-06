import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Card from './card'
import * as LanguageCode from './languageCode'

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
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Keyword
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
