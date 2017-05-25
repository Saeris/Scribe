import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'
import Models from '../models'
import { LanguageCode } from './'

export const Input = new GraphQLInputObjectType({
  name: `ImageInput`,
  description: `Required fields for a new Name object`,
  fields: () => ({
    multiverseid: { type: GraphQLString },
    url:          { type: new GraphQLNonNull(GraphQLString) },
    language:     { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ImageFilter`,
  description: `Queryable fields for Image.`,
  fields: () => ({
    multiverseid: { type: new GraphQLList(GraphQLString) },
    language:     { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `ImageFields`,
  description: `Field names for Image.`,
  values: {
    multiverseid: { value: `multiverseid` },
    language:     { value: `language` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Image`,
  description: `An Image object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this image.`
    },
    multiverseid: {
      type: GraphQLString,
      description: `The multiverseid of the card on Wizard’s Gatherer web page.`
    },
    url: {
      type: GraphQLString,
      description: `The localized image of a card.`
    },
    language: {
      type: LanguageCode.Definition,
      description: `The language image.`,
      resolve: (type) => Models.LanguageCode
        .findById(type.language)
        .then(model => model.toJSON())
    }
  })
})

export const Queries = {
  image: {
    type: new GraphQLList(Definition),
    description: `Returns an Image.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`image`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createImage: {
    type: Definition,
    description: `Creates a new Image`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateImage: {
    type: Definition,
    description: `Updates an existing Image, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `multiverseid`)
  },
  deleteImage: {
    type: Definition,
    description: `Deletes a Image by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
