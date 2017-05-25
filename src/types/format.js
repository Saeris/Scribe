import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Set } from './'

export const Input = new GraphQLInputObjectType({
  name: `FormatInput`,
  description: `Required fields for a new Format object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    sets: { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `FormatFilter`,
  description: `Queryable fields for Format.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `FormatFields`,
  description: `Field names for Format.`,
  values: {
    name: { value: `name` }
  }
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
  format: {
    type: new GraphQLList(Definition),
    description: `Returns a Format.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`format`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createFormat: {
    type: Definition,
    description: `Creates a new Format`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateFormat: {
    type: Definition,
    description: `Updates an existing Format, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteFormat: {
    type: Definition,
    description: `Deletes a Format by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
