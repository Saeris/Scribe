import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Icon  from './icon'

export const Input = new GraphQLInputObjectType({
  name: `LayoutInput`,
  description: `Required fields for a new Layout object`,
  fields: () => ({
    name:      { type: new GraphQLNonNull(GraphQLString) },
    watermark: { type: GraphQLString },
    icons:     { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
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
      resolve: (root, { id }) => Models.Layout
        .forge({ id })
        .fetch({ withRelated: [`icons`] })
        .then(model => model.toJSON().icons)
    }
  })
})

export const Queries = {
  getLayout: {
    type: new GraphQLList(Definition),
    description: `Returns a Layout with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Layout
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listLayouts: {
    type: new GraphQLList(Definition),
    description: `Lists all Layouts.`,
    resolve: (root, { id }) => Models.Layout
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createLayout: {
    type: Definition,
    description: `Creates a new Layout`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Layout
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateLayout: {
    type: Definition,
    description: `Updates an existing Layout, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Layout
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteLayout: {
    type: Definition,
    description: `Deletes a Layout by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Layout
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
