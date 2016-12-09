import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as colorIdentity } from './colorIdentity'

export const Definition = new GraphQLObjectType({
  name: 'Color',
  description: 'A Color object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this color.`
    },
    symbol: {
      type: GraphQLString,
      description: `The color symbol code for this color.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display a mana symbol for this color.`
    },
    indentity: {
      type: colorIdentity,
      description: `The color identity of this color.`
    }
  })
})

export const Queries = {
  color: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.color
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  colors: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.color
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
