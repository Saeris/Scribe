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
import { Format, FormatFilter, FormatOrder } from "./format"

export const Definition = new GqlObject({
  name: `Legality`,
  description: `A Legality object`,
  interfaces: [nodeInterface],
  sqlTable: `legality`,
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
      description: `The Legality ID`,
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
    cards: {
      type: CardConnection,
      description: `The ID of the card.`,
      args: { ...connectionArgs, ...CardFilter, ...CardOrder },
      junction: junction(`legalitycards`),
      where,
      orderBy,
      resolve: ({ cards }, args) => connectionFromArray(cards, args)
    },
    format: {
      type: !disabled && new GqlNonNull(Format),
      description: `The format the card is legal in.`,
      column: table => table.string(`format`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...FormatFilter, ...FormatOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`format`)
    },
    legal: {
      type: new GqlNonNull(GqlBool),
      description: `Set to True if the card is Legal to play in the given format.`,
      sqlColumn: `legal`,
      column: table => table.boolean(`legal`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: GqlBool }
    },
    restricted: {
      type: new GqlNonNull(GqlBool),
      description: `Set to True if the card is restricted in the given format.`,
      sqlColumn: `legal`,
      column: table => table.boolean(`legal`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: GqlBool }
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  legality: {
    type: new GqlList(Definition),
    description: `Returns a Legality.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createLegality: {
    type: Definition,
    description: `Creates a new Legality`,
    args: { ...Input },
    resolve: create
  },
  updateLegality: {
    type: Definition,
    description: `Updates an existing Legality, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteLegality: {
    type: Definition,
    description: `Deletes a Legality by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Legality,
  Connection as LegalityConnection,
  Filter as LegalityFilter,
  Input as LegalityInput,
  Order as LegalityOrder
}

export default { Definition, Queries, Mutations }
