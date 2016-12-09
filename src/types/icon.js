import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Icon',
  description: 'An Icon object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this icon.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the icon.`
    },
    image: {
      type: GraphQLString,
      description: `A url to an image for this icon.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display this icon.`
    }
  })
})

export const Queries = {
  icon: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.icon
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  icons: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.icon
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
