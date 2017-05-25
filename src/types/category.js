import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Card } from './'

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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createCategory: {
    type: Definition,
    description: `Creates a new Category`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateCategory: {
    type: Definition,
    description: `Updates an existing Category, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteCategory: {
    type: Definition,
    description: `Deletes a Category by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
