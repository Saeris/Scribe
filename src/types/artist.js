import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'
import * as Card from './card'

export const Input = new GraphQLInputObjectType({
  name: `ArtistInput`,
  description: `Required fields for a new Artist object`,
  fields: () => ({
    name:    { type: new GraphQLNonNull(GraphQLString) },
    website: { type: GraphQLString },
    cards:   { type: new GraphQLList(GraphQLID) }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Artist`,
  description: `An Artist object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this artist.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the artist.`
    },
    website: {
      type: GraphQLString,
      description: `A URL to the artist's website, if they have one.`
    },
    cards: {
      type: new GraphQLList(Card.Definition),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, { id }) => Models.Artist
        .forge({ id })
        .fetch({ withRelated: [`cards`] })
        .then(model => model.toJSON().cards)
    }
  })
})

export const Queries = {
  getArtist: {
    type: new GraphQLList(Definition),
    description: `Returns an Artist with the given ID.`,
    args: {
      id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))) }
    },
    resolve: (root, { id }) => Models.Artist
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listArtists: {
    type: new GraphQLList(Definition),
    description: `Lists all Artists.`,
    resolve: (root, { id }) => Models.Artist
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createArtist: {
    type: Definition,
    description: `Creates a new Artist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Artist
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateArtist: {
    type: Definition,
    description: `Updates an existing Artist, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Artist
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteArtist: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Rarity
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
