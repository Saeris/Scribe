import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import order from './utilities/order'
import Models from '../models'
import * as LanguageCode from './languageCode'

export const Input = new GraphQLInputObjectType({
  name: `ImageInput`,
  description: `Required fields for a new Name object`,
  fields: () => ({
    url:      { type: new GraphQLNonNull(GraphQLString) },
    multiverseid: { type: new GraphQLNonNull(GraphQLString) },
    language: { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ImageFilter`,
  description: `Queryable fields for Image.`,
  fields: () => ({
    language: { type: new GraphQLList(GraphQLID) },
    multiverseid: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `ImageFields`,
  description: `Field names for Image.`,
  values: {
    language: { value: `language` },
    multiverseid: { value: `multiverseid` }
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
      description: `The multiverseid of the card on Wizard’s Gatherer web page. Cards from sets that do not exist on Gatherer will NOT have a multiverseid. Sets not on Gatherer are: ATH, ITP, DKM, RQS, DPA and all sets with a 4 letter code that starts with a lowercase 'p’.`
    },
    url: {
      type: GraphQLString,
      description: `The localized image of a card.`
    },
    language: {
      type: LanguageCode.Definition,
      description: `The language image.`,
      resolve: (type) => Models.Image
        .findById(type.id, { withRelated: [`language`] })
        .then(model => model.toJSON().language)
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
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Image
      .query(qb => {
        if (!!id) qb.whereIn(`id`, id)
        if (!!filter) {
          for (let field in filter) {
            qb.whereIn(field, filter[field])
          }
        }
        if (!!limit) qb.limit(limit)
        if (!!offset) qb.offset(offset)
        if (!!orderBy) qb.orderBy(...Object.values(orderBy))
      })
      .fetchAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createImage: {
    type: Definition,
    description: `Creates a new Image`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Image
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateImage: {
    type: Definition,
    description: `Updates an existing Image, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Image
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteImage: {
    type: Definition,
    description: `Deletes a Image by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Image
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
