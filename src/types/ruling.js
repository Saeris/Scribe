import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { GraphQLDate } from 'graphql-iso-date'
import order from './utilities/order'
import Models from '../models'
import * as Card from './card'
import * as LanguageCode from './languageCode'

export const Input = new GraphQLInputObjectType({
  name: `RulingInput`,
  description: `Required fields for a new Ruling object`,
  fields: () => ({
    text:     { type: new GraphQLNonNull(GraphQLString) },
    date:     { type: new GraphQLNonNull(GraphQLDate) },
    language: { type: new GraphQLNonNull(GraphQLID) },
    cards:    { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `RulingFilter`,
  description: `Queryable fields for Ruling.`,
  fields: () => ({
    text:     { type: GraphQLString },
    date:     { type: new GraphQLList(GraphQLDate) },
    language: { type: new GraphQLList(GraphQLID) },
    cards:    { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `RulingFields`,
  description: `Field names for Ruling.`,
  values: {
    date:     { value: `date` },
    language: { value: `language` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Ruling`,
  description: `A Ruling object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this ruling.`
    },
    text: {
      type: GraphQLString,
      description: `The text of the ruling.`
    },
    date: {
      type: GraphQLDate,
      description: `The date this ruling was issued.`
    },
    language: {
      type: LanguageCode.Definition,
      description: `The language code of this ruling.`,
      resolve: (root, { id }) => Models.Ruling
        .forge({ id })
        .fetch({ withRelated: [`language`] })
        .then(model => model.toJSON().language)
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `List of cards that have this ruling.`,
      resolve: (root, { id }) => Models.Ruling
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  ruling: {
    type: new GraphQLList(Definition),
    description: `Returns a Ruling.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`ruling`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Ruling
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
  createRuling: {
    type: Definition,
    description: `Creates a new Ruling`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Ruling
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateRuling: {
    type: Definition,
    description: `Updates an existing Ruling, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Ruling
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteRuling: {
    type: Definition,
    description: `Deletes a Ruling by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Ruling
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
