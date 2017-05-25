import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLEnumType, GraphQLList, GraphQLObjectType, GraphQLInputObjectType } from 'graphql'
import { create, destroy, order, read, update } from './utilities'

export const Input = new GraphQLInputObjectType({
  name: `OwnedCardInput`,
  description: `Required fields for a new OwnedCard object`,
  fields: () => ({
    card: { type: new GraphQLNonNull(GraphQLID) }
  })
})

const Filter = new GraphQLInputObjectType({
  name: `OwnedCardFilter`,
  description: `Queryable fields for OwnedCard.`,
  fields: () => ({
    card: { type: new GraphQLList(GraphQLID) }
  })
})

const Fields = new GraphQLEnumType({
  name: `OwnedCardFields`,
  description: `Field names for OwnedCard.`,
  values: {
    card: { value: `card` }
  }
})

export const Definition = new GraphQLObjectType({
  name: `OwnedCard`,
  description: `A OwnedCard object`,
  fields: () => ({
    id: {
      type: GraphQLID,
      description: `A unique id for this owned card.`
    },
    card: {
      type: GraphQLID,
      description: `The card which this is an instance of.`
    }
  })
})

export const Queries = {
  ownedCard: {
    type: new GraphQLList(Definition),
    description: `Returns a OwnedCard.`,
    args: {
      id: { type: new GraphQLList(GraphQLID) },
      filter: {
        type: Filter
      },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      orderBy: { type: order(`ownedCard`, Fields) }
    },
    resolve: (parent, args, context) => read(parent, args, context, Definition.name)
  }
}

export const Mutations = {
  createOwnedCard: {
    type: Definition,
    description: `Creates a new OwnedCard`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => create(parent, args, context, Definition.name)
  },
  updateOwnedCard: {
    type: Definition,
    description: `Updates an existing OwnedCard, creates it if it does not already exist`,
    args: { input: { type: Input } },
    resolve: (parent, args, context) => update(parent, args, context, Definition.name)
  },
  deleteOwnedCard: {
    type: Definition,
    description: `Deletes a OwnedCard by id`,
    args: { id: { type: GraphQLID } },
    resolve: (parent, args, context) => destroy(parent, args, context, Definition.name)
  }
}
