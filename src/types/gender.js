import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `GenderInput`,
  description: `Required fields for a new Gender object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `GenderFilter`,
  description: `Queryable fields for Gender.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `GenderFields`,
  description: `Field names for Gender.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Gender`,
  description: `A Gender object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this gender.`
    },
    name: {
      type: GraphQLString,
      description: `The gender's name.`
    }
  })
})

export const Queries = {
  gender: {
    type: new GraphQLList(Definition),
    description: `Returns a Gender.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`gender`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createGender: {
    type: Definition,
    description: `Creates a new Gender`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateGender: {
    type: Definition,
    description: `Updates an existing Gender, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteGender: {
    type: Definition,
    description: `Deletes a Gender by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
