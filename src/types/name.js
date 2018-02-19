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
  orderBy,
  where
} from "@/utilities"
import { Card, CardFilter, CardOrder } from "./card"
import { Language, LanguageFilter, LanguageOrder } from "./language"

export const Definition = new GqlObject({
  name: `Name`,
  description: `A Name object`,
  interfaces: [nodeInterface],
  sqlTable: `name`,
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
      description: `The Name ID`,
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
      description: `The localized Name of a Card.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    language: {
      type: !disabled && new GqlNonNull(Language),
      description: `The Language for this Name.`,
      column: table => table.string(`language`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...LanguageFilter, ...LanguageOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`language`)
    },
    card: {
      type: !disabled && new GqlNonNull(Card),
      description: `The Card with this Name.`,
      column: table => table.string(`card`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...CardFilter, ...CardOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`card`)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  name: {
    type: new GqlList(Definition),
    description: `Returns a Name.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createName: {
    type: Definition,
    description: `Creates a new Name`,
    args: { ...Input },
    resolve: create
  },
  updateName: {
    type: Definition,
    description: `Updates an existing Name, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteName: {
    type: Definition,
    description: `Deletes a Name by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Name,
  Connection as NameConnection,
  Filter as NameFilter,
  Input as NameInput,
  Order as NameOrder
}

export default { Definition, Queries, Mutations }
