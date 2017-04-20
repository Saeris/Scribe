import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `SupertypeInput`,
  description: `Required fields for a new Supertype object`,
  fields: () => ({
    id:   { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
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
  getSupertype: {
    type: new GraphQLList(Definition),
    description: `Returns a Supertype with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Supertype
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listSupertypes: {
    type: new GraphQLList(Definition),
    description: `Lists all Supertypes.`,
    resolve: (root, { id }) => Models.Supertype
      .findAll()
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
