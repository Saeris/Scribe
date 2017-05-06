import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
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
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Block
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
