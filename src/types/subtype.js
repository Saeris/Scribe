import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `SubtypeInput`,
  description: `Required fields for a new Subtype object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `SubtypeFilter`,
  description: `Queryable fields for Subtype.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `SubtypeFields`,
  description: `Field names for Subtype.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Subtype`,
  description: `A Subtype object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this subtype.`
    },
    name: {
      type: GraphQLString,
      description: `The subtype name.`
    }
  })
})

export const Queries = {
  subtype: {
    type: new GraphQLList(Definition),
    description: `Returns a Subtype.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`subtype`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createSubtype: {
    type: Definition,
    description: `Creates a new Subtype`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateSubtype: {
    type: Definition,
    description: `Updates an existing Subtype, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteSubtype: {
    type: Definition,
    description: `Deletes a Subtype by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
