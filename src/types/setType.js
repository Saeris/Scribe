import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `SetTypeInput`,
  description: `Required fields for a new Set Type object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    description:  { type: new GraphQLNonNull(GraphQLString) }
  })
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
  getSetType: {
    type: new GraphQLList(Definition),
    description: `Returns a Set Type with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.SetType
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listSetTypes: {
    type: new GraphQLList(Definition),
    description: `Lists all Set Types.`,
    resolve: (root, { id }) => Models.SetType
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createSetType: {
    type: Definition,
    description: `Creates a new SetType`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.SetType
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateSetType: {
    type: Definition,
    description: `Updates an existing SetType, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.SetType
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteSetType: {
    type: Definition,
    description: `Deletes a SetType by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.SetType
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
