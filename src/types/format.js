import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Set } from './set'

export const Definition = new GraphQLObjectType({
  name: 'Format',
  description: 'A Format object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this format.`
    },
    name: {
      type: GraphQLString,
      description: `The format name.`
    },
    sets: {
      type: new GraphQLList(Set),
      description: `A list of sets included in this format`
    }
  })
})

export const Queries = {
  format: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Format
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  formats: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Format
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
