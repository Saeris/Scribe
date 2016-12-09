import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as set } from './set'

export const Definition = new GraphQLObjectType({
  name: 'Printing',
  description: 'An Printing object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this printing.`
    },
    cardID: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ID of the card associated with this printing.`
    },
    set: {
      type: new GraphQLNonNull(set),
      description: `The set the card was printed in.`
    }
  })
})

export const Queries = {
  printing: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.printing
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  printings: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.printing
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
