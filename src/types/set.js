import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { GraphQLDate } from 'graphql-iso-date'
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
  getSet: {
    type: new GraphQLList(Definition),
    description: `Returns a Set with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Set
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listSets: {
    type: new GraphQLList(Definition),
    description: `Lists all Sets.`,
    resolve: (root, { id }) => Models.Set
      .findAll()
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
      .then(model => model.toJSON())
  },
  updateSet: {
    type: Definition,
    description: `Updates an existing Set, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Set
      .upsert(input, input)
      .then(model => model.toJSON())
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
