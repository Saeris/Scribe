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
import { IconConnection, IconFilter, IconOrder } from "./icon"

export const Definition = new GqlObject({
  name: `Layout`,
  description: `A Layout object`,
  interfaces: [nodeInterface],
  sqlTable: `layout`,
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
      description: `The Layout ID`,
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
      description: `The name of the Layout.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    watermark: {
      type: GqlString,
      description: `Watermark that appears in this layout.`,
      sqlColumn: `watermark`,
      column: table => table.string(`watermark`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    icons: {
      type: IconConnection,
      description: `A list of icons featured on this card.`,
      args: { ...connectionArgs, ...IconFilter, ...IconOrder },
      junction: junction(`icons`),
      where,
      orderBy,
      resolve: ({ icons }, args) => connectionFromArray(icons, args)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  layout: {
    type: new GqlList(Definition),
    description: `Returns a Layout.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createLayout: {
    type: Definition,
    description: `Creates a new Layout`,
    args: { ...Input },
    resolve: create
  },
  updateLayout: {
    type: Definition,
    description: `Updates an existing Layout, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteLayout: {
    type: Definition,
    description: `Deletes a Layout by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Layout,
  Connection as LayoutConnection,
  Filter as LayoutFilter,
  Input as LayoutInput,
  Order as LayoutOrder
}

export default { Definition, Queries, Mutations }
