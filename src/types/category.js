import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Card } from './card'

export const Definition = new GraphQLObjectType({
  name: 'Category',
  description: 'A Category object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this category.`
    },
    name: {
      type: GraphQLString,
      description: `The category name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the category.`
    },
    cards: {
      type: new GraphQLList(Card),
      description: `A list of cards that have this category.`,
      resolve: (root, {artist}) => {
        return Models.Category
          .forge({artist: artist.id})
          .fetch({withRelated: ['cards']})
          .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  category: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Category
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  categories: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Category
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
