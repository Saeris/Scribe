import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Keyword',
  description: 'An Keyword object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this keyword.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the keyword.`
    },
    reminderText: {
      type: GraphQLString,
      description: `A short description of the keyword ability's rules.`
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
      return Models.keyword
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
      return Models.keyword
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
