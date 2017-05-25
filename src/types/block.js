import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Set } from './'

export const Input = new GraphQLInputObjectType({
  name: `BlockInput`,
  description: `Required fields for a new Block object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `BlockFilter`,
  description: `Queryable fields for Block.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) },
    sets: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `BlockFields`,
  description: `Field names for Block.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Block`,
  description: `A Block object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this block.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the block.`
    },
    sets: {
      type: new GraphQLList(Set.Definition),
      description: `List of sets that are included in this block.`,
      resolve: (type) => Models.Block
        .findById(type.id, { withRelated: [`sets`] })
        .then(model => model.toJSON().sets)
    }
  })
})

export const Queries = {
  block: {
    type: new GraphQLList(Definition),
    description: `Returns a Block.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`block`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createBlock: {
    type: Definition,
    description: `Creates a new Block`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateBlock: {
    type: Definition,
    description: `Updates an existing Block, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteBlock: {
    type: Definition,
    description: `Deletes a Block by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
