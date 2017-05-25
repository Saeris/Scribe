import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, loadRelated, order, read, update } from './utilities'
import Models from '../models'
import { OwnedCard, Tag } from './'

export const Input = new GraphQLInputObjectType({
  name: `DeckInput`,
  description: `Required fields for a new Deck object`,
  fields: () => ({
    name:        { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    privacy:     { type: new GraphQLNonNull(GraphQLInt) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `DeckFilter`,
  description: `Queryable fields for Deck.`,
  fields: () => ({
    name:      { type: new GraphQLList(GraphQLString) },
    privacy:   { type: new GraphQLList(GraphQLInt) },
    tags:      { type: new GraphQLList(GraphQLID) },
    decklist:  { type: new GraphQLList(GraphQLID) },
    sideboard: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `DeckFields`,
  description: `Field names for Deck.`,
  values: {
    name:    { value: `name` },
    privacy: { value: `privacy` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Deck`,
  description: `A Deck object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this deck.`
    },
    name: {
      type: GraphQLString,
      description: `The deck name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the deck.`
    },
    privacy: {
      type: GraphQLInt,
      description: `The deck's privacy setting.`
    },
    tags: {
      type: new GraphQLList(Tag.Definition),
      description: `A list of tags associated with this deck.`,
      resolve: type => loadRelated(type.id, Models.Deck, `tags`)
    },
    decklist: {
      type: new GraphQLList(OwnedCard.Definition),
      description: `The main list of owned cards used in this deck.`,
      resolve: type => loadRelated(type.id, Models.Deck, `decklist`)
    },
    sideboard: {
      type: new GraphQLList(OwnedCard.Definition),
      description: `A list of owned cards that are use in this deck's sideboard.`,
      resolve: type => loadRelated(type.id, Models.Deck, `sideboard`)
    }
  })
})

export const Queries = {
  deck: {
    type: new GraphQLList(Definition),
    description: `Returns a Deck.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`deck`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createDeck: {
    type: Definition,
    description: `Creates a new Deck`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateDeck: {
    type: Definition,
    description: `Updates an existing Deck, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteDeck: {
    type: Definition,
    description: `Deletes a Deck by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
