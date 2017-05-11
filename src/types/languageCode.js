import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Language from './language'

export const Input = new GraphQLInputObjectType({
  name: `LanguageCodeInput`,
  description: `Required fields for a new language code object`,
  fields: () => ({
    code:     { type: new GraphQLNonNull(GraphQLString) },
    language: { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `LanguageCodeFilter`,
  description: `Queryable fields for LanguageCode.`,
  fields: () => ({
    code:     { type: new GraphQLList(GraphQLString) },
    language: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `LanguageCodeFields`,
  description: `Field names for LanguageCode.`,
  values: {
    code: { value: `code` },
    language : { value: `language` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `LanguageCode`,
  description: `A language code object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this language.`
    },
    code: {
      type: GraphQLString,
      description: `The language code.`
    },
    language: {
      type: Language.Definition,
      description: `The language associated with the language code.`,
      resolve: (type) => Models.LanguageCode
        .findById(type.id, { withRelated: [`language`] })
        .then(model => model.toJSON().language)
    }
  })
})

export const Queries = {
  languageCode: {
    type: new GraphQLList(Definition),
    description: `Returns a LanguageCode.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`languageCode`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.LanguageCode
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
  createLanguageCode: {
    type: Definition,
    description: `Creates a new LanguageCode`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.LanguageCode
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateLanguageCode: {
    type: Definition,
    description: `Updates an existing LanguageCode, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.LanguageCode
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteLanguageCode: {
    type: Definition,
    description: `Deletes a LanguageCode by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.LanguageCode
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
