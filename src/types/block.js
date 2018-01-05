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
  name: `Block`,
  description: `A Block object`,
  interfaces: [nodeInterface],
  sqlTable: `block`,
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
      description: `The Block ID.`,
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
      description: `The Block name.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    sets: {
      type: CardSetConnection,
      description: `List of sets that are included in this block.`,
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
  block: {
    type: new GqlList(Definition),
    description: `Returns a Block.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createBlock: {
    type: Definition,
    description: `Creates a new Block`,
    args: { ...Input },
    resolve: create
  },
  updateBlock: {
    type: Definition,
    description: `Updates an existing Block, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteBlock: {
    type: Definition,
    description: `Deletes a Block by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Block,
  Connection as BlockConnection,
  Filter as BlockFilter,
  Input as BlockInput,
  Order as BlockOrder
}

export default { Definition, Queries, Mutations }
