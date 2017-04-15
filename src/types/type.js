import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `TypeInput`,
  description: `Required fields for a new Type object`,
  fields: () => ({
    id:   { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
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
  getType: {
    type: new GraphQLList(Definition),
    description: `Returns a Type with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Type
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listTypes: {
    type: new GraphQLList(Definition),
    description: `Lists all Types.`,
    resolve: (root, { id }) => Models.Type
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createType: {
    type: Definition,
    description: `Creates a new Type`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Type
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateType: {
    type: Definition,
    description: `Updates an existing Type, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Type
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteType: {
    type: Definition,
    description: `Deletes a Type by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Type
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
