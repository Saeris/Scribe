import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Set from './set'

export const Input = new GraphQLInputObjectType({
  name: `BlockInput`,
  description: `Required fields for a new Block object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    sets: { type: new GraphQLList(GraphQLID) }
  })
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
      resolve: (root, { id }) => Models.Block
        .forge({ id })
        .fetch({ withRelated: [`sets`] })
        .then(model => model.toJSON().sets)
    }
  })
})

export const Queries = {
  getBlock: {
    type: new GraphQLList(Definition),
    description: `Returns a Block with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Block
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listBlocks: {
    type: new GraphQLList(Definition),
    description: `Lists all Blocks.`,
    resolve: (root, { id }) => Models.Block
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createBlock: {
    type: Definition,
    description: `Creates a new Block`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Block
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateBlock: {
    type: Definition,
    description: `Updates an existing Block, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Block
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteBlock: {
    type: Definition,
    description: `Deletes a Block by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Block
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
