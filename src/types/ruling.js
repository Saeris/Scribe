import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Card } from './card'
import { Definition as LanguageCode } from './languageCode'

export const Definition = new GraphQLObjectType({
  name: 'Ruling',
  description: 'An Ruling object',
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
      type: GraphQLString,
      description: `The date this ruling was issued.`
    },
    language: {
      type: LanguageCode,
      description: `The language code of this ruling.`
    },
    cards: {
      type: new GraphQLList(Card),
      description: `List of cards that have this ruling.`,
      resolve: (root, {artist}) => {
        return Models.Ruling
          .forge({artist: artist.id})
          .fetch({withRelated: ['cards']})
          .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  ruling: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Ruling
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  rulings: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Ruling
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
