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
import { TagConnection, TagFilter, TagOrder } from './tag'
import { OwnedCardConnection, OwnedCardFilter, OwnedCardOrder } from './ownedCard'

export const Definition = new GqlObject({
  name: `Binder`,
  description: `A Binder object`,
  interfaces: [nodeInterface],
  sqlTable: `binder`,
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
      description: `The Binder ID.`,
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
      description: `The Binder name.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    description: {
      type: new GqlNonNull(GqlString),
      description: `The description of the binder.`,
      sqlColumn: `description`,
      column: table => table.string(`description`).notNullable(),
      input: true
    },
    privacy: {
      type: new GqlNonNull(GqlInt),
      description: `The Binder's privacy setting.`,
      sqlColumn: `description`,
      column: table => table.integer(`privacy`).notNullable(),
      input: true
    },
    tags: {
      type: TagConnection,
      description: `A list of Tags associated with this Binder.`,
      args: { ...connectionArgs, ...TagFilter, ...TagOrder },
      junction: junction(`tags`),
      where,
      orderBy,
      resolve: ({ tags }, args) => connectionFromArray(tags, args)
    },
    cards: {
      type: OwnedCardConnection,
      description: `A list of Cards that belong to this Binder.`,
      args: { ...connectionArgs, ...OwnedCardFilter, ...OwnedCardOrder },
      junction: junction(`bindercards`),
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
  binder: {
    type: new GqlList(Definition),
    description: `Returns a Binder.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createBinder: {
    type: Definition,
    description: `Creates a new Binder`,
    args: { ...Input },
    resolve: create
  },
  updateBinder: {
    type: Definition,
    description: `Updates an existing Binder, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteBinder: {
    type: Definition,
    description: `Deletes a Binder by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Binder,
  Connection as BinderConnection,
  Filter as BinderFilter,
  Input as BinderInput,
  Order as BinderOrder
}

export default { Definition, Queries, Mutations }
