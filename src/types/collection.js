import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  create,
  read,
  update,
  destroy,
  sqlJoin,
  junction,
  orderBy,
  where
} from "@/utilities"
import { BinderConnection, BinderFilter, BinderOrder } from "./binder"
import { DeckConnection, DeckFilter, DeckOrder } from "./deck"
import { OwnedCardConnection, OwnedCardFilter, OwnedCardOrder } from "./ownedCard"
import { User, UserFilter, UserOrder } from "./user"

export const Definition = new GqlObject({
  name: `Collection`,
  description: `A Collection object`,
  interfaces: [nodeInterface],
  sqlTable: `collection`,
  uniqueKey: `id`,
  timestamps: table => table.timestamps(),
  fields: disabled => ({
    globalId: {
      ...globalId(),
      description: `The global ID for the Relay spec`,
      sqlDeps: [`id`]
    },
    id: {
      type: new GqlNonNull(GqlID),
      description: `A unique id for this collection.`,
      sqlColumn: `id`,
      column: table => table.string(`id`).notNullable().primary().unique()
    },
    created: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `created`,
      sortable: true,
      filter: { type: DateRange }
    },
    updated: {
      type: new GqlNonNull(GqlDateTime),
      sqlColumn: `updated`,
      sortable: true,
      filter: { type: DateRange }
    },
    owner: {
      type: new GqlNonNull(User),
      description: `A unique id for this collection.`,
      sqlColumn: `owner`,
      column: table => table.string(`owner`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...UserFilter, ...UserOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`owner`)
    },
    cards: {
      type: OwnedCardConnection,
      description: `A list of cards that belong to this collection.`,
      args: { ...connectionArgs, ...OwnedCardFilter, ...OwnedCardOrder },
      junction: junction(`collectioncards`),
      where,
      orderBy,
      resolve: ({ cards }, args) => connectionFromArray(cards, args)
    },
    binders: {
      type: BinderConnection,
      description: `A list of binders that belong to this collection.`,
      args: { ...connectionArgs, ...BinderFilter, ...BinderOrder },
      junction: junction(`binders`),
      where,
      orderBy,
      resolve: ({ binders }, args) => connectionFromArray(binders, args)
    },
    decks: {
      type: DeckConnection,
      description: `A list of decks that belong to this collection.`,
      args: { ...connectionArgs, ...DeckFilter, ...DeckOrder },
      junction: junction(`decks`),
      where,
      orderBy,
      resolve: ({ decks }, args) => connectionFromArray(decks, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  collection: {
    type: new GqlList(Definition),
    description: `Returns a Collection.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createCollection: {
    type: Definition,
    description: `Creates a new Collection`,
    args: { ...Input },
    resolve: create
  },
  updateCollection: {
    type: Definition,
    description: `Updates an existing Collection, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteCollection: {
    type: Definition,
    description: `Deletes a Collection by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Collection,
  Connection as CollectionConnection,
  Filter as CollectionFilter,
  Input as CollectionInput,
  Order as CollectionOrder
}

export default { Definition, Queries, Mutations }
