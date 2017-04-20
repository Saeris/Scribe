import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './card'
import * as Language from './language'

export const Input = new GraphQLInputObjectType({
  name: `NameInput`,
  description: `Required fields for a new Name object`,
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    language: { type: new GraphQLNonNull(GraphQLID) },
    cards:    { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Name`,
  description: `A Name object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this name.`
    },
    name: {
      type: GraphQLString,
      description: `The localized name of a card.`
    },
    language: {
      type: Language.Definition,
      description: `The language name.`,
      resolve: (root, { id }) => Models.Name
        .forge({ id })
        .fetch({ withRelated: [`language`] })
        .then(model => model.toJSON().language)
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, { id }) => Models.Name
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  getName: {
    type: new GraphQLList(Definition),
    description: `Returns a Name with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Name
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listNames: {
    type: new GraphQLList(Definition),
    description: `Lists all Names.`,
    resolve: (root, { id }) => Models.Name
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createName: {
    type: Definition,
    description: `Creates a new Name`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Name
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateName: {
    type: Definition,
    description: `Updates an existing Name, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Name
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteName: {
    type: Definition,
    description: `Deletes a Name by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Name
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
