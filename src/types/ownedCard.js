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

export const Definition = new GqlObject({
  name: `OwnedCard`,
  description: `A OwnedCard object`,
  interfaces: [nodeInterface],
  sqlTable: `ownedCard`,
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
      description: `The OwnedCard ID`,
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
    card: {
      type: !disabled && new GqlNonNull(Card),
      description: `The Card for which this is an Instance of.`,
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
  ownedCard: {
    type: new GqlList(Definition),
    description: `Returns a OwnedCard.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createOwnedCard: {
    type: Definition,
    description: `Creates a new OwnedCard`,
    args: { ...Input },
    resolve: create
  },
  updateOwnedCard: {
    type: Definition,
    description: `Updates an existing OwnedCard, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteOwnedCard: {
    type: Definition,
    description: `Deletes a OwnedCard by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as OwnedCard,
  Connection as OwnedCardConnection,
  Filter as OwnedCardFilter,
  Input as OwnedCardInput,
  Order as OwnedCardOrder
}

export default { Definition, Queries, Mutations }
