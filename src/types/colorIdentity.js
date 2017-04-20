import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Color from './color'

export const Input = new GraphQLInputObjectType({
  name: `ColorIdentityInput`,
  description: `Required fields for a new Color Identity object`,
  fields: () => ({
    name:         { type: new GraphQLNonNull(GraphQLString) },
    alias:        { type: GraphQLString },
    colors:       { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    multicolored: { type: new GraphQLList(GraphQLBoolean) },
    devoid:       { type: new GraphQLList(GraphQLBoolean) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `ColorIdentity`,
  description: `A Color Identity object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this color identity.`
    },
    name: {
      type: GraphQLString,
      description: `The color identity name.`
    },
    alias: {
      type: GraphQLString,
      description: `The alias of the color identity. Examples: Bant, Jeskai`
    },
    colors: {
      type: new GraphQLList(Color.Definition),
      description: `A list of colors included in this color identity.`,
      resolve: (root, { id }) => Models.ColorIdentity
        .forge({ id })
        .fetch({ withRelated: [`colors`] })
        .then(model => model.toJSON().colors)
    },
    multicolored: {
      type: GraphQLBoolean,
      description: `Set to True if the color identity counts as multicolored.`
    },
    devoid: {
      type: GraphQLBoolean,
      description: `Set to True if the color identity counts as devoid.`
    }
  })
})

export const Queries = {
  getColorIdentity: {
    type: new GraphQLList(Definition),
    description: `Returns a Color Identity with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Coloridentity
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listColorIdentities: {
    type: new GraphQLList(Definition),
    description: `Lists all Color Identities.`,
    resolve: (root, { id }) => Models.Coloridentity
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createColorIdentity: {
    type: Definition,
    description: `Creates a new ColorIdentity`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.ColorIdentity
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateColorIdentity: {
    type: Definition,
    description: `Updates an existing ColorIdentity, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.ColorIdentity
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteColorIdentity: {
    type: Definition,
    description: `Deletes a ColorIdentity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.ColorIdentity
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
