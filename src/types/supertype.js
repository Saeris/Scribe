import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Supertype',
  description: 'A Supertype object',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `A unique id for this supertype.`
    },
    name: {
      type: GraphQLString,
      description: `The supertype name.`
    }
  })
})

export const Queries = {
  supertype: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.supertype
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  supertypes: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.supertype
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {
  createSupertype: {
    type: Definition,
    description: `Creates a new Supertype`,
    args: {
      name: {
        name: 'name',
        description: `The Name of the Supertype. (Required)`,
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve(root, {name}) {
      return Models.supertype
        .upsert({name: name}, {name: name})
        .then((model) => {
          return model.toJSON()
        })
    }
  }
}
