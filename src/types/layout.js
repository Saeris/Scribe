import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as icon }  from './icon'

export const Definition = new GraphQLObjectType({
  name: 'Layout',
  description: 'A Layout object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this layout.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the layout type.`
    },
    icons: {
      type: new GraphQLList(icon),
      description: `A list of icons featured on this card.`
    },
    watermark: {
      type: GraphQLString,
      description: `Watermark that appears in this layout.`
    }
  })
})

export const Queries = {
  layout: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.layout
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  layouts: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.layout
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
