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
import { CardSetConnection, CardSetFilter, CardSetOrder } from './set'

export const Definition = new GqlObject({
  name: `Format`,
  description: `A Format object`,
  interfaces: [nodeInterface],
  sqlTable: `format`,
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
      description: `The Format ID`,
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
      description: `The name of the Format.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    sets: {
      type: CardSetConnection,
      description: `A list of sets included in this format`,
      args: { ...connectionArgs, ...CardSetFilter, ...CardSetOrder },
      junction: junction(`blocksets`),
      where,
      orderBy,
      resolve: ({ sets }, args) => connectionFromArray(sets, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  format: {
    type: new GqlList(Definition),
    description: `Returns a Format.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createFormat: {
    type: Definition,
    description: `Creates a new Format`,
    args: { ...Input },
    resolve: create
  },
  updateFormat: {
    type: Definition,
    description: `Updates an existing Format, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteFormat: {
    type: Definition,
    description: `Deletes a Format by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Format,
  Connection as FormatConnection,
  Filter as FormatFilter,
  Input as FormatInput,
  Order as FormatOrder
}

export default { Definition, Queries, Mutations }
