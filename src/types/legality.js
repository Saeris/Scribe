import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as format } from './format'

export const Definition = new GraphQLObjectType({
  name: 'Legality',
  description: 'A Legality object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this name.`
    },
    cardID: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ID of the card.`
    },
    format: {
      type: format,
      description: `The format the card is legal in.`
    },
    legal: {
      type: GraphQLBoolean,
      description: `Set to True if the card is Legal to play in the given format.`
    },
    restricted: {
      type: GraphQLBoolean,
      description: `Set to True if the card is restricted in the given format.`
    }
  })
})

export const Queries = {
  legality: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.legality
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  legalities: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.legality
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
