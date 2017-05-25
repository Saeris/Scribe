import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `LanguageInput`,
  description: `Required fields for a new language object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `LanguageFilter`,
  description: `Queryable fields for Language.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) },
    code: { type: new GraphQLList(GraphQLString) }
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
      type: GraphQLString,
      description: `The language code.`
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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createLanguage: {
    type: Definition,
    description: `Creates a new Language`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateLanguage: {
    type: Definition,
    description: `Updates an existing Language, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteLanguage: {
    type: Definition,
    description: `Deletes a Language by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
