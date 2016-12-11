import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'
import { Definition as Block } from './block'
import { Definition as SetType } from './setType'
import { Definition as Icon } from './icon'
import { Definition as Booster } from './booster'

export const Definition = new GraphQLObjectType({
  name: 'Set',
  description: 'A Set object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this set.`
    },
    name: {
      type: GraphQLString,
      description: `The set name.`
    },
    code: {
      type: GraphQLString,
      description: `The set code for this set.`
    },
    block: {
      type: Block,
      description: `The block the set belongs to.`
    },
    type: {
      type: SetType,
      description: `The set type.`
    },
    icon: {
      type: Icon,
      description: `The icon associated with the set.`
    },
    border: {
      type: GraphQLString,
      description: `The card border color for this set.`
    },
    releaseDate: {
      type: GraphQLString,
      description: `The date this card was released. This is only set for promo cards. The date may not be accurate to an exact day and month, thus only a partial date may be set (YYYY-MM-DD or YYYY-MM or YYYY). Some promo cards do not have a known release date.`
    },
    booster: {
      type: Booster,
      description: `A booster pack for this set`
    }
  })
})

export const Queries = {
  set: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Set
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  sets: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Set
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {

}
