import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as Card from './card'

export const Input = new GraphQLInputObjectType({
  name: `CategoryInput`,
  description: `Required fields for a new Category object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    cards:       { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `CategoryFilter`,
  description: `Queryable fields for Category.`,
  fields: () => ({
    name:  { type: new GraphQLList(GraphQLString) },
    cards: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `CategoryFields`,
  description: `Field names for Category.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Category`,
  description: `A Category object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this category.`
    },
    name: {
      type: GraphQLString,
      description: `The category name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the category.`
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `A list of cards that have this category.`,
      resolve: (root, { id }) => Models.Category
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  category: {
    type: new GraphQLList(Definition),
    description: `Returns a Category.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`category`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Category
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
  createCategory: {
    type: Definition,
    description: `Creates a new Category`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Category
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateCategory: {
    type: Definition,
    description: `Updates an existing Category, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Category
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteCategory: {
    type: Definition,
    description: `Deletes a Category by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Category
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
