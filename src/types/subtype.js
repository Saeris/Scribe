import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType } from 'graphql'
import Models from '../models'

export const Definition = new GraphQLObjectType({
  name: 'Subtype',
  description: 'A Subtype object',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this subtype.`
    },
    name: {
      type: GraphQLString,
      description: `The subtype name.`
    }
  })
})

export const Queries = {
  subtype: {
    type: new GraphQLList(Definition),
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
      }
    },
    resolve(root, {id}) {
      return Models.Subtype
        .where('id', 'IN', id)
        .fetchAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  },
  subtypes: {
    type: new GraphQLList(Definition),
    resolve(root, {id}) {
      return Models.Subtype
        .findAll()
        .then((collection) => {
          return collection.toJSON()
        })
    }
  }
}

export const Mutations = {
  createSubtype: {
    type: Definition,
    description: `Creates a new Subtype`,
    args: {
      name: {
        name: 'name',
        description: `The Name of the Subtype. (Required)`,
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve(root, {name}) {
      return Models.Subtype
        .upsert({name: name}, {name: name})
        .then((model) => {
          return model.toJSON()
        })
    }
  }
}
