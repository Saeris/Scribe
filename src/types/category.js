import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Category',
  description: 'A Category object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this category.`
    },
    name: {
      type: GraphQLString,
      description: `The category name.`
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
      return Models.category
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
      return Models.category
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
