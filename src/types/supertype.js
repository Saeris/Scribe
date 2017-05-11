import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `SupertypeInput`,
  description: `Required fields for a new Supertype object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `SupertypeFilter`,
  description: `Queryable fields for Supertype.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `SupertypeFields`,
  description: `Field names for Supertype.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Supertype`,
  description: `A Supertype object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this supertype.`
    },
    name: {
      type: GraphQLString,
      description: `The supertype name.`
    }
  })
})

export const Queries = {
  supertype: {
    type: new GraphQLList(Definition),
    description: `Returns a Supertype.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`supertype`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Supertype
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
  createSupertype: {
    type: Definition,
    description: `Creates a new Supertype`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Supertype
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateSupertype: {
    type: Definition,
    description: `Updates an existing Supertype, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Supertype
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteSupertype: {
    type: Definition,
    description: `Deletes a Supertype by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Supertype
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
