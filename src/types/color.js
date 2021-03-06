import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { ColorIdentity, Icon } from './'

export const Input = new GraphQLInputObjectType({
  name: `ColorInput`,
  description: `Required fields for a new Color object`,
  fields: () => ({
    symbol:   { type: new GraphQLNonNull(GraphQLString) },
    icon:     { type: GraphQLID },
    identity: { type: GraphQLID }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ColorFilter`,
  description: `Queryable fields for Color.`,
  fields: () => ({
    symbol:   { type: new GraphQLList(GraphQLString) },
    icon:     { type: new GraphQLList(GraphQLID) },
    identity: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `ColorFields`,
  description: `Field names for Color.`,
  values: {
    symbol: { value: `symbol` },
    icon:   { value: `icon` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Color`,
  description: `A Color object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this color.`
    },
    symbol: {
      type: GraphQLString,
      description: `The color symbol code for this color.`
    },
    icon: {
      type: Icon.Definition,
      description: `A CSS class used to display a mana symbol for this color.`,
      resolve: (type) => Models.Color
        .findById(type.id, { withRelated: [`icon`] })
        .then(model => model.toJSON().icon)
    },
    identity: {
      type: ColorIdentity.Definition,
      description: `The color identity of this color.`,
      resolve: (type) => Models.Color
        .findById(type.id, { withRelated: [`identity`] })
        .then(model => model.toJSON().identity)
    }
  })
})

export const Queries = {
  color: {
    type: new GraphQLList(Definition),
    description: `Returns a Color.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`color`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createColor: {
    type: Definition,
    description: `Creates a new Color`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateColor: {
    type: Definition,
    description: `Updates an existing Color, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `symbol`)
  },
  deleteColor: {
    type: Definition,
    description: `Deletes a Color by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
