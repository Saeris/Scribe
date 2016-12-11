import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Card } from './card'
import { Definition as LanguageCode } from './languageCode'

export const Definition = new GraphQLObjectType({
  name: 'Keyword',
  description: 'A Keyword object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this keyword.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the keyword.`
    },
    reminderText: {
      type: GraphQLString,
      description: `A short description of the keyword ability's rules.`
    },
    languageCode: {
      type: LanguageCode,
      description: `The language code the reminder text of keyword is localized in.`
    },
    cards: {
      type: new GraphQLList(Card),
      description: `A list of cards featuring art from this artist.`,
      resolve: (root, {artist}) => {
        return Model.Keyword
          .forge({artist: artist.id})
          .fetch({withRelated: ['cards']})
          .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  keyword: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Keyword
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  keywords: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Keyword
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
