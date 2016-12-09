import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Ruling',
  description: 'An Ruling object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this ruling.`
    },
    cardID: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ID of the card associated with this ruling.`
    },
    date: {
      type: GraphQLString,
      description: `The date this ruling was issued.`
    },
    text: {
      type: GraphQLString,
      description: `The text of the ruling.`
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
      return Models.ruling
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
      return Models.ruling
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
