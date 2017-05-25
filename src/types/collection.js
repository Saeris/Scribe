import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, loadRelated, order, read, update } from './utilities'
import Models from '../models'
import { Binder, Deck, OwnedCard, User } from './'

export const Input = new GraphQLInputObjectType({
  name: `CollectionInput`,
  description: `Required fields for a new Collection object`,
  fields: () => ({
    owner: { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `CollectionFilter`,
  description: `Queryable fields for Collection.`,
  fields: () => ({
    owner:   { type: new GraphQLList(GraphQLID) },
    cards:   { type: new GraphQLList(GraphQLID) },
    binders: { type: new GraphQLList(GraphQLID) },
    decks:   { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `CollectionFields`,
  description: `Field names for Collection.`,
  values: {
    owner: { value: `owner` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Collection`,
  description: `A Collection object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this collection.`
    },
    owner: {
      type: User.Definition,
      description: `A unique id for this collection.`,
      resolve: type => load(type.owner, Models.User)
    },
    cards: {
      type: new GraphQLList(OwnedCard.Definition),
      description: `A list of cards that belong to this collection.`,
      resolve: type => loadRelated(type.id, Models.Collection, `cards`)
    },
    binders: {
      type: new GraphQLList(Binder.Definition),
      description: `A list of binders that belong to this collection.`,
      resolve: type => loadRelated(type.id, Models.Collection, `binders`)
    },
    decks: {
      type: new GraphQLList(Deck.Definition),
      description: `A list of decks that belong to this collection.`,
      resolve: type => loadRelated(type.id, Models.Collection, `decks`)
    }
  })
})

export const Queries = {
  collection: {
    type: new GraphQLList(Definition),
    description: `Returns a Collection.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`collection`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createCollection: {
    type: Definition,
    description: `Creates a new Collection`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateCollection: {
    type: Definition,
    description: `Updates an existing Collection, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `owner`)
  },
  deleteCollection: {
    type: Definition,
    description: `Deletes a Collection by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
