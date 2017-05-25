import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `SetTypeInput`,
  description: `Required fields for a new Set Type object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    description:  { type: GraphQLString }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `SetTypeFilter`,
  description: `Queryable fields for SetType.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `SetTypeFields`,
  description: `Field names for SetType.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `SetType`,
  description: `A Set Type object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this Set Type.`
    },
    name: {
      type: GraphQLString,
      description: `The Set Type name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the Set Type.`
    }
  })
})

export const Queries = {
  setType: {
    type: new GraphQLList(Definition),
    description: `Returns a Set Type.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`setType`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createSetType: {
    type: Definition,
    description: `Creates a new SetType`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateSetType: {
    type: Definition,
    description: `Updates an existing SetType, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteSetType: {
    type: Definition,
    description: `Deletes a SetType by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
