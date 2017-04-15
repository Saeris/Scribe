import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
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
  getCategory: {
    type: new GraphQLList(Definition),
    description: `Returns a Category with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Category
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listCategories: {
    type: new GraphQLList(Definition),
    description: `Lists all Categories.`,
    resolve: (root, { id }) => Models.Category
      .findAll()
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
