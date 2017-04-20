import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `SubtypeInput`,
  description: `Required fields for a new Subtype object`,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) }
  })
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
  getSubtype: {
    type: new GraphQLList(Definition),
    description: `Returns a Subtype with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Subtype
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listSubtypes: {
    type: new GraphQLList(Definition),
    description: `Lists all Subtypes.`,
    resolve: (root, { id }) => Models.Subtype
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createSubtype: {
    type: Definition,
    description: `Creates a new Subtype`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Subtype
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateSubtype: {
    type: Definition,
    description: `Updates an existing Subtype, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Subtype
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteSubtype: {
    type: Definition,
    description: `Deletes a Subtype by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Subtype
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
