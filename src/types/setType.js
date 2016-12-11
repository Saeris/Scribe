import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'SetType',
  description: 'A Set Type object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this Set Type.`
    },
    name: {
      type: GraphQLString,
      description: `The Set Type name.`
    },
    description: {
      type: GraphQLString,
      description: `The description of the Set Type.`
    }
  })
})

export const Queries = {
  setType: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.SetType
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  SetTypes: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.SetType
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
