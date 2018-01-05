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
  name: `Type`,
  description: `A Type object`,
  interfaces: [nodeInterface],
  sqlTable: `type`,
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
      description: `The Type ID.`,
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
      description: `The name of the Type.`,
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
    description: `Returns a Type.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createType: {
    type: Definition,
    description: `Creates a new Type`,
    args: { ...Input },
    resolve: create
  },
  updateType: {
    type: Definition,
    description: `Updates an existing Type, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteType: {
    type: Definition,
    description: `Deletes a Type by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Type,
  Connection as TypeConnection,
  Filter as TypeFilter,
  Input as TypeInput,
  Order as TypeOrder
}

export default { Definition, Queries, Mutations }
