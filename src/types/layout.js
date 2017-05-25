import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, loadRelated, order, read, update } from './utilities'
import Models from '../models'
import { Icon } from './'

export const Input = new GraphQLInputObjectType({
  name: `LayoutInput`,
  description: `Required fields for a new Layout object`,
  fields: () => ({
    name:      { type: new GraphQLNonNull(GraphQLString) },
    watermark: { type: GraphQLString },
    icons:     { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `LayoutFilter`,
  description: `Queryable fields for Layout.`,
  fields: () => ({
    name:  { type: new GraphQLList(GraphQLString) },
    icons: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `LayoutFields`,
  description: `Field names for Layout.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Layout`,
  description: `A Layout object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this layout.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the layout type.`
    },
    watermark: {
      type: GraphQLString,
      description: `Watermark that appears in this layout.`
    },
    icons: {
      type: new GraphQLList(Icon.Definition),
      description: `A list of icons featured on this card.`,
      resolve: type => loadRelated(type.id, Models.Layout, `icons`)
    }
  })
})

export const Queries = {
  layout: {
    type: new GraphQLList(Definition),
    description: `Returns a Layout.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`layout`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createLayout: {
    type: Definition,
    description: `Creates a new Layout`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateLayout: {
    type: Definition,
    description: `Updates an existing Layout, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteLayout: {
    type: Definition,
    description: `Deletes a Layout by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
