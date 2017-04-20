import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
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
      resolve: (root, { id }) => Models.LanguageCode
        .forge({ id })
        .fetch({ withRelated: [`language`] })
        .then(model => model.toJSON().language)
    }
  })
})

export const Queries = {
  getLanguageCode: {
    type: new GraphQLList(Definition),
    description: `Returns a Language Code with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.LanguageCode
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listLanguageCodes: {
    type: new GraphQLList(Definition),
    description: `Lists all Language Codes.`,
    resolve: (root, { id }) => Models.LanguageCode
      .findAll()
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
