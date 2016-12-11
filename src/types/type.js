import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Type',
  description: 'A Type object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this type.`
    },
    name: {
      type: GraphQLString,
      description: `The type name.`
    }
  })
})

export const Queries = {
  type: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Type
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  types: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Type
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {
  createType: {
    type: Definition,
    description: `Creates a new Type`,
    args: {
      name: {
        name: 'name',
        description: `The Name of the Type. (Required)`,
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve(root, {name}) {
      return Models.Type
        .upsert({name: name}, {name: name})
        .then((model) => {
          return model.toJSON()
        })
    }
  }
}
