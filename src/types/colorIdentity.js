import { GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { destroy, loadRelated, order, read } from './utilities'
import Models from '../models'
import { Color } from './'

export const Input = new GraphQLInputObjectType({
  name: `ColorIdentityInput`,
  description: `Required fields for a new Color Identity object`,
  fields: () => ({
    name:         { type: new GraphQLNonNull(GraphQLString) },
    alias:        { type: GraphQLString },
    colors:       { type: new GraphQLList(GraphQLID) },
    multicolored: { type: GraphQLBoolean },
    devoid:       { type: GraphQLBoolean }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ColorIdentityFilter`,
  description: `Queryable fields for ColorIdentity.`,
  fields: () => ({
    name:         { type: new GraphQLList(GraphQLString) },
    alias:        { type: new GraphQLList(GraphQLString) },
    multicolored: { type: GraphQLBoolean },
    devoid:       { type: GraphQLBoolean }
  })
})

const Fields = new GraphQLEnumType({
  name: `ColorIdentityFields`,
  description: `Field names for ColorIdentity.`,
  values: {
    name:         { value: `name` },
    alias:        { value: `alias` },
    multicolored: { value: `multicolored` },
    devoid:       { value: `devoid` }
  }
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
      resolve: type => loadRelated(type.id, Models.ColorIdentity, `colors`)
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
  colorIdentity: {
    type: new GraphQLList(Definition),
    description: `Returns a ColorIdentity.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`colorIdentity`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createColorIdentity: {
    type: Definition,
    description: `Creates a new ColorIdentity`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => {
      let { colors, ...fields } = input
      return Models.ColorIdentity
        .findOrCreate(fields)
        .then(model => {
          let identity = model.toJSON()

          if (!!colors) for (let color of colors) Models.Colors.findOrCreate({ coloridentity: identity.id, color })

          return identity
        })
    }
  },
  updateColorIdentity: {
    type: Definition,
    description: `Updates an existing ColorIdentity, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => {
      let { name, colors, ...fields } = input
      return Models.ColorIdentity
        .upsert({ name }, fields)
        .then(model => {
          let identity = model.toJSON()

          if (!!colors) for (let color of colors) Models.Colors.findOrCreate({ coloridentity: identity.id, color })

          return identity
        })
    }
  },
  deleteColorIdentity: {
    type: Definition,
    description: `Deletes a ColorIdentity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
