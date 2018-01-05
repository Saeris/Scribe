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
import { CardConnection, CardFilter, CardOrder } from "./card"
import { Language, LanguageFilter, LanguageOrder } from "./language"

export const Definition = new GqlObject({
  name: `Ruling`,
  description: `A Ruling object`,
  interfaces: [nodeInterface],
  sqlTable: `ruling`,
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
      description: `The Ruling ID.`,
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
    text: {
      type: new GqlNonNull(GqlString),
      description: `The text of the Ruling.`,
      sqlColumn: `text`,
      column: table => table.string(`text`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    date: {
      type: new GqlNonNull(GqlDateTime),
      description: `The date this Ruling was issued.`,
      sqlColumn: `date`,
      column: table => table.string(`date`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: DateRange }
    },
    language: {
      type: Language,
      description: `The Language for this Ruling.`,
      column: table => table.string(`language`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...LanguageFilter, ...LanguageOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`language`)
    },
    cards: {
      type: CardConnection,
      description: `The Cards associated with this Ruling.`,
      args: { ...connectionArgs, ...CardFilter, ...CardOrder },
      junction: junction(`rulingcards`),
      where,
      orderBy,
      resolve: ({ cards }, args) => connectionFromArray(cards, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  ruling: {
    type: new GqlList(Definition),
    description: `Returns a Ruling.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createRuling: {
    type: Definition,
    description: `Creates a new Ruling`,
    args: { ...Input },
    resolve: create
  },
  updateRuling: {
    type: Definition,
    description: `Updates an existing Ruling, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteRuling: {
    type: Definition,
    description: `Deletes a Ruling by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Ruling,
  Connection as RulingConnection,
  Filter as RulingFilter,
  Input as RulingInput,
  Order as RulingOrder
}

export default { Definition, Queries, Mutations }
