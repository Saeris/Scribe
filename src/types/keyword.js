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
  name: `Keyword`,
  description: `A Keyword object`,
  interfaces: [nodeInterface],
  sqlTable: `image`,
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
      description: `The Keyword ID`,
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
      description: `The name of the keyword.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    reminderText: {
      type: new GqlNonNull(GqlString),
      description: `A short description of the keyword ability's rules.`,
      sqlColumn: `reminderText`,
      column: table => table.string(`reminderText`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    language: {
      type: Language,
      description: `The language code the reminder text of keyword is localized in.`,
      sqlColumn: `language`,
      column: table => table.string(`language`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...LanguageFilter, ...LanguageOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`language`)
    },
    cards: {
      type: CardConnection,
      description: `A list of cards featuring art from this artist.`,
      args: { ...connectionArgs, ...CardFilter, ...CardOrder },
      junction: junction(`abilitytypecards`),
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
  keyword: {
    type: new GqlList(Definition),
    description: `Returns a Keyword.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createKeyword: {
    type: Definition,
    description: `Creates a new Keyword`,
    args: { ...Input },
    resolve: create
  },
  updateKeyword: {
    type: Definition,
    description: `Updates an existing Keyword, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteKeyword: {
    type: Definition,
    description: `Deletes a Keyword by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Keyword,
  Connection as KeywordConnection,
  Filter as KeywordFilter,
  Input as KeywordInput,
  Order as KeywordOrder
}

export default { Definition, Queries, Mutations }
