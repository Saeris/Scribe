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
import { ColorIdentity, ColorIdentityFilter, ColorIdentityOrder } from "./colorIdentity"
import { Icon, IconFilter, IconOrder } from "./icon"

export const Definition = new GqlObject({
  name: `Color`,
  description: `A Color object`,
  interfaces: [nodeInterface],
  sqlTable: `color`,
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
      description: `The Color ID`,
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
    symbol: {
      type: new GqlNonNull(GqlString),
      description: `The color symbol code for this color.`,
      sqlColumn: `symbol`,
      column: table => table.string(`symbol`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    icon: {
      type: new GqlNonNull(Icon),
      description: `A CSS class used to display a mana symbol for this color.`,
      column: table => table.string(`icon`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...IconFilter, ...IconOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`icon`)
    },
    identity: {
      type: new GqlNonNull(ColorIdentity),
      description: `The color identity of this color.`,
      column: table => table.string(`identity`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...ColorIdentityFilter, ...ColorIdentityOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`identity`)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  color: {
    type: new GqlList(Definition),
    description: `Returns a Color.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createColor: {
    type: Definition,
    description: `Creates a new Color`,
    args: { ...Input },
    resolve: create
  },
  updateColor: {
    type: Definition,
    description: `Updates an existing Color, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteColor: {
    type: Definition,
    description: `Deletes a Color by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Color,
  Connection as ColorConnection,
  Filter as ColorFilter,
  Input as ColorInput,
  Order as ColorOrder
}

export default { Definition, Queries, Mutations }
