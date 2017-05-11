import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { GraphQLDate } from 'graphql-iso-date'
import order from './utilities/order'
import Models from '../models'
import * as Block from './block'
import * as SetType from './setType'
import * as Icon from './icon'
import * as Booster from './booster'

export const Input = new GraphQLInputObjectType({
  name: `SetInput`,
  description: `Required fields for a new Set object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    code:        { type: new GraphQLNonNull(GraphQLString) },
    block:       { type: GraphQLID },
    type:        { type: new GraphQLNonNull(GraphQLID)},
    icon:        { type: new GraphQLNonNull(GraphQLID) },
    border:      { type: new GraphQLNonNull(GraphQLString) },
    releaseDate: { type: new GraphQLNonNull(GraphQLDate) },
    booster:     { type: GraphQLID }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `SetFilter`,
  description: `Queryable fields for Set.`,
  fields: () => ({
    name:        { type: new GraphQLList(GraphQLString) },
    code:        { type: new GraphQLList(GraphQLString) },
    block:       { type: new GraphQLList(GraphQLID) },
    type:        { type: new GraphQLList(GraphQLID) },
    border:      { type: new GraphQLList(GraphQLString) },
    releaseDate: { type: new GraphQLList(GraphQLDate) }
  })
})

const Fields = new GraphQLEnumType({
  name: `SetFields`,
  description: `Field names for Set.`,
  values: {
    name:        { value: `name` },
    code:        { value: `code` },
    block:       { value: `block` },
    type:        { value: `type` },
    border:      { value: `border` },
    releaseDate: { value: `releaseDate` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Set`,
  description: `A Set object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this set.`
    },
    name: {
      type: GraphQLString,
      description: `The set name.`
    },
    code: {
      type: GraphQLString,
      description: `The set code for this set.`
    },
    block: {
      type: Block.Definition,
      description: `The block the set belongs to.`,
      resolve: (type) => Models.Set
        .findById(type.id, { withRelated: [`block`] })
        .then(model => model.toJSON().block)
    },
    type: {
      type: SetType.Definition,
      description: `The set type.`,
      resolve: (type) => Models.Set
        .findById(type.id, { withRelated: [`type`] })
        .then(model => model.toJSON().type)
    },
    icon: {
      type: Icon.Definition,
      description: `The icon associated with the set.`,
      resolve: (type) => Models.Set
        .findById(type.id, { withRelated: [`icon`] })
        .then(model => model.toJSON().icon)
    },
    border: {
      type: GraphQLString,
      description: `The card border color for this set.`
    },
    releaseDate: {
      type: GraphQLDate,
      description: `The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`
    },
    booster: {
      type: Booster.Definition,
      description: `A booster pack for this set`,
      resolve: (type) => Models.Set
        .findById(type.id, { withRelated: [`booster`] })
        .then(model => model.toJSON().booster)
    }
  })
})

export const Queries = {
  set: {
    type: new GraphQLList(Definition),
    description: `Returns a Set.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`set`, Fields) }
    },
    resolve: (root, { id, filter, limit, offset, orderBy }) => Models.Set
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
  createSet: {
    type: Definition,
    description: `Creates a new Set`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Set
      .findOrCreate(input)
      .then(model => {
        let set = model.toJSON()

        if (!!set.block) Models.BlockSets.findOrCreate({ block: set.block, set: set.id })

        return set
      })
  },
  updateSet: {
    type: Definition,
    description: `Updates an existing Set, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Set
      .upsert(input, input)
      .then(model => {
        let set = model.toJSON()

        if (!!set.block) Models.BlockSets.findOrCreate({ block: set.block, set: set.id })

        return set
      })
  },
  deleteSet: {
    type: Definition,
    description: `Deletes a Set by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Set
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
