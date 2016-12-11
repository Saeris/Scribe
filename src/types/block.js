import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Set } from './set'

export const Definition = new GraphQLObjectType({
  name: 'Block',
  description: 'A Block object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this block.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the block.`
    },
    sets: {
      type: new GraphQLList(Set),
      description: `List of sets that are included in this block.`,
      resolve: (root, {artist}) => {
        return Models.Block
          .forge({artist: artist.id})
          .fetch({withRelated: ['cards']})
          .then(artist => artist.toJSON().cards)
      }
    }
  })
})

export const Queries = {
  block: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Block
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  blocks: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Block
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
