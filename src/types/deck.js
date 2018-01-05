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
  junction,
  orderBy,
  where
} from "@/utilities"
import { OwnedCardConnection, OwnedCardFilter, OwnedCardOrder } from "./ownedCard"
import { TagConnection, TagFilter, TagOrder } from "./tag"

export const Definition = new GqlObject({
  name: `Deck`,
  description: `A Deck object`,
  interfaces: [nodeInterface],
  sqlTable: `deck`,
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
      description: `The Deck ID`,
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
    name: {
      type: new GqlNonNull(GqlString),
      description: `The name of the Deck.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    description: {
      type: GqlString,
      description: `Description of the Deck.`,
      sqlColumn: `description`,
      column: table => table.string(`description`),
      input: true
    },
    privacy: {
      type: new GqlNonNull(GqlInt),
      description: `The deck's privacy setting.`,
      sqlColumn: `description`,
      column: table => table.integer(`description`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlInt) }
    },
    tags: {
      type: TagConnection,
      description: `A list of tags associated with this deck.`,
      args: { ...connectionArgs, ...TagFilter, ...TagOrder },
      junction: junction(`tags`),
      where,
      orderBy,
      resolve: ({ tags }, args) => connectionFromArray(tags, args)
    },
    decklist: {
      type: OwnedCardConnection,
      description: `The main list of owned cards used in this deck.`,
      args: { ...connectionArgs, ...OwnedCardFilter, ...OwnedCardOrder },
      junction: junction(`decklist`),
      where,
      orderBy,
      resolve: ({ decklist }, args) => connectionFromArray(decklist, args)
    },
    sideboard: {
      type: OwnedCardConnection,
      description: `A list of owned cards that are use in this deck's sideboard.`,
      args: { ...connectionArgs, ...OwnedCardFilter, ...OwnedCardOrder },
      junction: junction(`sideboard`),
      where,
      orderBy,
      resolve: ({ sideboard }, args) => connectionFromArray(sideboard, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  deck: {
    type: new GqlList(Definition),
    description: `Returns a Deck.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createDeck: {
    type: Definition,
    description: `Creates a new Deck`,
    args: { ...Input },
    resolve: create
  },
  updateDeck: {
    type: Definition,
    description: `Updates an existing Deck, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteDeck: {
    type: Definition,
    description: `Deletes a Deck by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Deck,
  Connection as DeckConnection,
  Filter as DeckFilter,
  Input as DeckInput,
  Order as DeckOrder
}

export default { Definition, Queries, Mutations }
