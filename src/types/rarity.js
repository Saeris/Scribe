import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Rarity',
  description: 'A Rarity object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this rarity.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the rarity.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display this rarity.`
    }
  })
})

export const Queries = {
  rarity: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.rarity
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  rarities: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.rarity
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
