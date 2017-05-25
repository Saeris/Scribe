import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

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
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createSupertype: {
    type: Definition,
    description: `Creates a new Supertype`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateSupertype: {
    type: Definition,
    description: `Updates an existing Supertype, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteSupertype: {
    type: Definition,
    description: `Deletes a Supertype by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
