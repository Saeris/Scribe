import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, loadRelated, order, read, update } from './utilities'
import Models from '../models'
import { OwnedCard, Tag } from './'

export const Input = new GraphQLInputObjectType({
  name: `BinderInput`,
  description: `Required fields for a new Binder object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    privacy:     { type: new GraphQLNonNull(GraphQLInt) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `BinderFilter`,
  description: `Queryable fields for Binder.`,
  fields: () => ({
    name:    { type: new GraphQLList(GraphQLString) },
    privacy: { type: new GraphQLList(GraphQLInt) },
    tags:    { type: new GraphQLList(GraphQLID) },
    cards:   { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `BinderFields`,
  description: `Field names for Binder.`,
  values: {
    name:    { value: `name` },
    privacy: { value: `privacy` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Binder`,
  description: `A Binder object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this binder.`
    },
    name: {
      type: GraphQLString,
      description: `The binder name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the binder.`
    },
    privacy: {
      type: GraphQLInt,
      description: `The binder's privacy setting.`
    },
    tags: {
      type: new GraphQLList(Tag.Definition),
      description: `A list of tags associated with this binder.`,
      resolve: type => loadRelated(type.id, Models.Binder, `tags`)
    },
    cards: {
      type: new GraphQLList(OwnedCard.Definition),
      description: `A list of cards that belong to this binder.`,
      resolve: type => loadRelated(type.id, Models.Binder, `cards`)
    }
  })
})

export const Queries = {
  binder: {
    type: new GraphQLList(Definition),
    description: `Returns a Binder.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`binder`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createBinder: {
    type: Definition,
    description: `Creates a new Binder`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateBinder: {
    type: Definition,
    description: `Updates an existing Binder, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteBinder: {
    type: Definition,
    description: `Deletes a Binder by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
