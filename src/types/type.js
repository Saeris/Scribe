import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `TypeInput`,
  description: `Required fields for a new Type object`,
  fields: () => ({
    id:   { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `TypeFilter`,
  description: `Queryable fields for Type.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `TypeFields`,
  description: `Field names for Type.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Type`,
  description: `A Type object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this type.`
    },
    name: {
      type: GraphQLString,
      description: `The type name.`
    }
  })
})

export const Queries = {
  type: {
    type: new GraphQLList(Definition),
    description: `Returns a Type.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`type`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createType: {
    type: Definition,
    description: `Creates a new Type`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateType: {
    type: Definition,
    description: `Updates an existing Type, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  destroyType: {
    type: Definition,
    description: `Deletes a Type by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
