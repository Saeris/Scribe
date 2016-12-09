import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Name',
  description: 'A Name object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this name.`
    },
    cardID: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ID of the named card.`
    },
    name: {
      type: GraphQLString,
      description: `The localized name of a card.`
    },
    language: {
      type: GraphQLString,
      description: `The language name.`
    },
    code: {
      type: GraphQLString,
      description: `The language code.`
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
      return Models.name
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
      return Models.name
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
