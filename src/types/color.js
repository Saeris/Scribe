import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as ColorIdentity from './colorIdentity'

export const Input = new GraphQLInputObjectType({
  name: `ColorInput`,
  description: `Required fields for a new Color object`,
  fields: () => ({
    symbol:   { type: GraphQLString },
    class:    { type: new GraphQLNonNull(GraphQLString) },
    identity: { type: new GraphQLList(GraphQLID) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Color`,
  description: `A Color object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this color.`
    },
    symbol: {
      type: GraphQLString,
      description: `The color symbol code for this color.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display a mana symbol for this color.`
    },
    identity: {
      type: ColorIdentity.Definition,
      description: `The color identity of this color.`,
      resolve: (root, { id }) => Models.Color
        .forge({ id })
        .fetch({ withRelated: [`colorIdentity`] })
        .then(model => model.toJSON().identity)
    }
  })
})

export const Queries = {
  getColor: {
    type: new GraphQLList(Definition),
    description: `Returns a Color with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Color
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listColors: {
    type: new GraphQLList(Definition),
    description: `Lists all Colors.`,
    resolve: (root, { id }) => Models.Color
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createColor: {
    type: Definition,
    description: `Creates a new Color`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Color
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateColor: {
    type: Definition,
    description: `Updates an existing Color, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Color
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteColor: {
    type: Definition,
    description: `Deletes a Color by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Color
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
