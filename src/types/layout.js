import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Icon }  from './icon'

export const Definition = new GraphQLObjectType({
  name: 'Layout',
  description: 'A Layout object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this layout.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the layout type.`
    },
    watermark: {
      type: GraphQLString,
      description: `Watermark that appears in this layout.`
    },
    icons: {
      type: new GraphQLList(Icon),
      description: `A list of icons featured on this card.`
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
      return Models.Layout
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
      return Models.Layout
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
