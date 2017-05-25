import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `ProfileInput`,
  description: `Required fields for a new Profile object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ProfileFilter`,
  description: `Queryable fields for Profile.`,
  fields: () => ({
    name: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `ProfileFields`,
  description: `Field names for Profile.`,
  values: {
    name: { value: `name` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Profile`,
  description: `A Profile object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this profile.`
    },
    service: {
      type: GraphQLString,
      description: `The name of the social media service.`
    },
    token: {
      type: GraphQLString,
      description: `The access token issued by the social media service.`
    }
  })
})

export const Queries = {
  profile: {
    type: new GraphQLList(Definition),
    description: `Returns a Profile.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`profile`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createProfile: {
    type: Definition,
    description: `Creates a new Profile`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateProfile: {
    type: Definition,
    description: `Updates an existing Profile, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name)
  },
  deleteProfile: {
    type: Definition,
    description: `Deletes a Profile by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
