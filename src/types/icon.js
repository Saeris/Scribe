import { GraphQLID, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import Models from '../models'

export const Input = new GraphQLInputObjectType({
  name: `IconInput`,
  description: `Required fields for a new Icon object`,
  fields: () => ({
    name:  { type: new GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLString },
    class: { type: GraphQLString }
  })
})

export const Definition = new GraphQLObjectType({
  name: `Icon`,
  description: `An Icon object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this icon.`
    },
    name: {
      type: GraphQLString,
      description: `The name of the icon.`
    },
    image: {
      type: GraphQLString,
      description: `A url to an image for this icon.`
    },
    class: {
      type: GraphQLString,
      description: `A CSS class used to display this icon.`
    }
  })
})

export const Queries = {
  getIcon: {
    type: new GraphQLList(Definition),
    description: `Returns an Icon with the given ID.`,
    args: { id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) } },
    resolve: (root, { id }) => Models.Icon
      .where(`id`, `IN`, id)
      .fetchAll()
      .then(collection => collection.toJSON())
  },
  listIcons: {
    type: new GraphQLList(Definition),
    description: `Lists all Icons.`,
    resolve: (root, { id }) => Models.Icon
      .findAll()
      .then(collection => collection.toJSON())
  }
}

export const Mutations = {
  createIcon: {
    type: Definition,
    description: `Creates a new Icon`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Icon
      .findOrCreate(input)
      .then(model => model.toJSON())
  },
  updateIcon: {
    type: Definition,
    description: `Updates an existing Icon, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (root, { input }) => Models.Icon
      .upsert(input, input)
      .then(model => model.toJSON())
  },
  deleteIcon: {
    type: Definition,
    description: `Deletes a Icon by id`,
    args: { id: { type: GraphQLID } },
    resolve: (root, { id }) => Models.Icon
      .destroy({ id })
      .then(model => model.toJSON())
  }
}
