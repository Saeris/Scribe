import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  read,
  update,
  destroy,
  junction,
  orderBy,
  where
} from "@/utilities"
import { createColorIdentity } from "@/resolvers"
import { ColorConnection, ColorFilter, ColorOrder } from './color'

export const Definition = new GqlObject({
  name: `ColorIdentity`,
  description: `A Color Identity object`,
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
      description: `The Color Identity ID`,
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
      description: `The name of the Color Identity.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    alias: {
      type: GqlString,
      description: `The alias of the color identity. Examples: Bant, Jeskai`,
      sqlColumn: `alias`,
      column: table => table.string(`alias`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    colors: {
      type: ColorConnection,
      description: `A list of colors included in this color identity.`,
      input: { type: new GqlNonNull(new GqlList(new GqlNonNull(GqlID))) },
      args: { ...connectionArgs, ...ColorFilter, ...ColorOrder },
      junction: junction(`colors`),
      where,
      orderBy,
      resolve: ({ colors }, args) => connectionFromArray(colors, args)
    },
    multicolored: {
      type: new GqlNonNull(GqlBool),
      description: `Set to True if the color identity counts as multicolored.`,
      sqlColumn: `multicolored`,
      column: table => table.boolean(`multicolored`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: GqlBool }
    },
    devoid: {
      type: new GqlNonNull(GqlBool),
      description: `Set to True if the color identity counts as devoid.`,
      sqlColumn: `devoid`,
      column: table => table.boolean(`devoid`).notNullable(),
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
  colorIdentity: {
    type: new GqlList(Definition),
    description: `Returns a ColorIdentity.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createColorIdentity: {
    type: Definition,
    description: `Creates a new ColorIdentity`,
    args: { ...Input },
    resolve: createColorIdentity
  },
  updateColorIdentity: {
    type: Definition,
    description: `Updates an existing ColorIdentity, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteColorIdentity: {
    type: Definition,
    description: `Deletes a ColorIdentity by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as ColorIdentity,
  Connection as ColorIdentityConnection,
  Filter as ColorIdentityFilter,
  Input as ColorIdentityInput,
  Order as ColorIdentityOrder
}

export default { Definition, Queries, Mutations }
