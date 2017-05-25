import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { Image } from './'

export const Input = new GraphQLInputObjectType({
  name: `IconInput`,
  description: `Required fields for a new Icon object`,
  fields: () => ({
    name:  { type: new GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLID },
    class: { type: GraphQLString }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `IconFilter`,
  description: `Queryable fields for Icon.`,
  fields: () => ({
    name:  { type: new GraphQLList(GraphQLString) },
    image: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `IconFields`,
  description: `Field names for Icon.`,
  values: {
    name:  { value: `name` },
    image: { value: `image` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Icon`,
  description: `An Icon object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this icon.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the icon.`
    },
    image: {
      type: Image.Definition,
      description: `The language image.`,
      resolve: (type) => Models.Icon
        .findById(type.id, { withRelated: [`image`] })
        .then(model => model.toJSON().image)
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display this icon.`
    }
  })
})

export const Queries = {
  icon: {
    type: new GraphQLList(Definition),
    description: `Returns an Icon.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`icon`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createIcon: {
    type: Definition,
    description: `Creates a new Icon`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateIcon: {
    type: Definition,
    description: `Updates an existing Icon, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteIcon: {
    type: Definition,
    description: `Deletes a Icon by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
