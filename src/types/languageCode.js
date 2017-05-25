import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Language } from './'

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
      resolve: (type) => Models.Language
        .findById(type.language)
        .then(model => model.toJSON())
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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createLanguageCode: {
    type: Definition,
    description: `Creates a new LanguageCode`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateLanguageCode: {
    type: Definition,
    description: `Updates an existing LanguageCode, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `code`)
  },
  deleteLanguageCode: {
    type: Definition,
    description: `Deletes a LanguageCode by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
