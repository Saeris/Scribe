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
  orderBy,
  where
} from "@/utilities"

export const Definition = new GqlObject({
  name: `Supertype`,
  description: `A Supertype object`,
  interfaces: [nodeInterface],
  sqlTable: `supertype`,
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
      description: `The Supertype ID.`,
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
      description: `The name of the Supertype.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  subtype: {
    type: new GqlList(Definition),
    description: `Returns a Supertype.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createSupertype: {
    type: Definition,
    description: `Creates a new Supertype`,
    args: { ...Input },
    resolve: create
  },
  updateSupertype: {
    type: Definition,
    description: `Updates an existing Supertype, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteSupertype: {
    type: Definition,
    description: `Deletes a Supertype by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as SuperType,
  Connection as SuperTypeConnection,
  Filter as SuperTypeFilter,
  Input as SuperTypeInput,
  Order as SuperTypeOrder
}

export default { Definition, Queries, Mutations }
