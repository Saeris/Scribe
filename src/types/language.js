import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as LanguageCode from './languageCode'

export const Input = new GraphQLInputObjectType({
  name: `LanguageInput`,
  description: `Required fields for a new language object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `LanguageFilter`,
  description: `Queryable fields for Language.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) },
    code: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `LanguageFields`,
  description: `Field names for Language.`,
  values: {
    name: { value: `name` },
    code: { value: `code` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Language`,
  description: `A language object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this language.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the language.`
    },
    code: {
      type: LanguageCode.Definition,
      description: `The language code associated with this language.`,
      resolve: (type) => Models.Language
        .findById(type.id, { withRelated: [`code`] })
        .then(model => model.toJSON().code)
    }
  })
})

export const Queries = {
  language: {
    type: new GraphQLList(Definition),
    description: `Returns a Language.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`language`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Language
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
  createLanguage: {
    type: Definition,
    description: `Creates a new Language`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Language
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateLanguage: {
    type: Definition,
    description: `Updates an existing Language, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Language
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteLanguage: {
    type: Definition,
    description: `Deletes a Language by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Language
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
