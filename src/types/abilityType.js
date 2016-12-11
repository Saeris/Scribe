import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Card } from './card'

export const Definition = new GraphQLObjectType({
  name: 'AbilityType',
  description: 'An Ability Type object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this ability type.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the ability type.`
    },
    description: {
      type: GraphQLString,
      description: `Description of the ability type.`
    },
    cards: {
      type: new GraphQLList(Card),
      description: `The cards associated with this abilityType.`
    }
  })
})

export const Queries = {
  abilitytype: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.AbilityType
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  abilitytypes: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.AbilityType
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
