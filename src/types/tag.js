import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLString, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `TagInput`,
  description: `Required fields for a new Tag object`,
  fields: () => ({
    tag: { type: new GraphQLNonNull(GraphQLString) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `TagFilter`,
  description: `Queryable fields for Tag.`,
  fields: () => ({
    tag: { type: new GraphQLList(GraphQLString) }
  })
})

const Fields = new GraphQLEnumType({
  name: `TagFields`,
  description: `Field names for Tag.`,
  values: {
    tag: { value: `tag` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `Tag`,
  description: `A Tag object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this tag.`
    },
    tag: {
      type: GraphQLString,
      description: `The text of the tag.`
    }
  })
})

export const Queries = {
  tag: {
    type: new GraphQLList(Definition),
    description: `Returns a Tag.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`tag`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createTag: {
    type: Definition,
    description: `Creates a new Tag`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateTag: {
    type: Definition,
    description: `Updates an existing Tag, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name, `tag`)
  },
  deleteTag: {
    type: Definition,
    description: `Deletes a Tag by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
