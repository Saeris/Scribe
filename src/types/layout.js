import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Icon  from './icon'

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
      resolve: (root, { id }) => Models.Layout
        .forge({ id })
        .fetch({ withRelated: [`icons`] })
        .then(model => model.toJSON().icons)
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
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Layout
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
