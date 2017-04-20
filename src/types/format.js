import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Set from './set'

export const Input = new GraphQLInputObjectType({
  name: `FormatInput`,
  description: `Required fields for a new Format object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    sets: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Format`,
  description: `A Format object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this format.`
    },
    name: {
      type: GraphQLString,
      description: `The format name.`
    },
    sets: {
      type: new GraphQLList(Set.Definition),
      description: `A list of sets included in this format`,
      resolve: (root, { id }) => Models.Format
        .forge({ id })
        .fetch({ withRelated: [`sets`] })
        .then(model => model.toJSON().sets)
    }
  })
})

export const Queries = {
  getFormat: {
    type: new GraphQLList(Definition),
    description: `Returns a Format with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Format
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listFormats: {
    type: new GraphQLList(Definition),
    description: `Lists all Formats.`,
    resolve: (root, { id }) => Models.Format
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createFormat: {
    type: Definition,
    description: `Creates a new Format`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Format
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateFormat: {
    type: Definition,
    description: `Updates an existing Format, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Format
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteFormat: {
    type: Definition,
    description: `Deletes a Format by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Format
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
