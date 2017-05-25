import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, loadRelated, order, read, update } from './utilities'
import Models from '../models'
import { Card } from './'

export const Input = new GraphQLInputObjectType({
  name: `ArtistInput`,
  description: `Required fields for a new Artist object`,
  fields: () => ({
    name:    { type: new GraphQLNonNull(GraphQLString) },
    website: { type: GraphQLString },
    cards:   { type: new GraphQLList(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `ArtistFilter`,
  description: `Queryable fields for Artist.`,
  fields: () => ({
    name:  { type: new GraphQLList(GraphQLString) },
    cards: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `ArtistFields`,
  description: `Field names for Artist.`,
  values: {
    name: { value: `name` }
  }
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
      resolve: type => loadRelated(type.id, Models.Artist, `cards`)
    }
  })
})

export const Queries = {
  artist: {
    type: new GraphQLList(Definition),
    description: `Returns a Artist.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`artist`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createArtist: {
    type: Definition,
    description: `Creates a new Artist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateArtist: {
    type: Definition,
    description: `Updates an existing Artist, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `name`)
  },
  deleteArtist: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
