import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as color } from './color'

export const Definition = new GraphQLObjectType({
  name: 'ColorIdentity',
  description: 'A Color Identity object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this color identity.`
    },
    name: {
      type: GraphQLString,
      description: `The color identity name.`
    },
    alias: {
      type: GraphQLString,
      description: `The alias of the color identity. Examples: Bant, Jeskai`
    },
    colors: {
      type: new GraphQLList(color),
      description: `A list of colors included in this color identity.`
    },
    multicolored: {
      type: GraphQLBoolean,
      description: `Set to True if the color identity counts as multicolored.`
    },
    devoid: {
      type: GraphQLBoolean,
      description: `Set to True if the color identity counts as devoid.`
    }
  })
})

export const Queries = {
  colorIdentity: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.coloridentity
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  colorIdentities: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.coloridentity
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
