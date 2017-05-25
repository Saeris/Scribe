import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Card, Language } from './'

export const Input = new GraphQLInputObjectType({
  name: `NameInput`,
  description: `Required fields for a new Name object`,
  fields: () => ({
    name:         { type: new GraphQLNonNull(GraphQLString) },
    language:     { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `NameFilter`,
  description: `Queryable fields for Name.`,
  fields: () => ({
    name:         { type: new GraphQLList(GraphQLString) },
    language:     { type: new GraphQLList(GraphQLID) },
    cards:        { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `NameFields`,
  description: `Field names for Name.`,
  values: {
    name:         { value: `name` },
    language:     { value: `language` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Name`,
  description: `A Name object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this name.`
    },
    name: {
      type: GraphQLString,
      description: `The localized name of a card.`
    },
    language: {
      type: Language.Definition,
      description: `The language name.`,
      resolve: (type) => Models.Language
        .findById(type.language)
        .then(model => model.toJSON())
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `A list of cards featuring art from this artist.`,
      resolve: (type) => Models.Name
        .findById(type.id, { withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  name: {
    type: new GraphQLList(Definition),
    description: `Returns a Name.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`name`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createName: {
    type: Definition,
    description: `Creates a new Name`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateName: {
    type: Definition,
    description: `Updates an existing Name, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteName: {
    type: Definition,
    description: `Deletes a Name by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
