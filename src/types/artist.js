import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as card } from './card'

export const Definition = new GraphQLObjectType({
  name: 'Artist',
  description: 'An Artist object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
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
      type: new GraphQLList(card),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, {artist}) => {
        return Models.artist.forge({artist: artist.id})
                            .fetch({withRelated: ['cards']})
                            .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  artist: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.artist
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  artists: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.artist
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
