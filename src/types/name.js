import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Card } from './card'
import { Definition as Language } from './language'

export const Definition = new GraphQLObjectType({
  name: 'Name',
  description: 'A Name object',
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
      type: Language,
      description: `The language name.`
    },
    cards: {
      type: new GraphQLList(Card),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, {artist}) => {
        return Models.Name
          .forge({artist: artist.id})
          .fetch({withRelated: ['cards']})
          .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  name: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Name
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  names: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Name
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
