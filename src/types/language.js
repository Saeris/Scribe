import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
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
      resolve: (root, { id }) => Models.Language
        .forge({ id })
        .fetch({ withRelated: [`code`] })
        .then(model => model.toJSON().code)
    }
  })
})

export const Queries = {
  getLanguage: {
    type: new GraphQLList(Definition),
    description: `Returns a Language with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Language
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listLanguages: {
    type: new GraphQLList(Definition),
    description: `Lists all Languages.`,
    resolve: (root, { id }) => Models.Language
      .findAll()
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
