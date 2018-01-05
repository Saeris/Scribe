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
  name: `Rarity`,
  description: `A Rarity object`,
  interfaces: [nodeInterface],
  sqlTable: `rarity`,
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
      description: `The Rarity ID.`,
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
      description: `The name of the Rarity.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    className: {
      type: new GqlNonNull(GqlString),
      description: `A CSS class used to display this Rarity.`,
      sqlColumn: `className`,
      column: table => table.string(`className`).notNullable().unique(),
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
  rarity: {
    type: new GqlList(Definition),
    description: `Returns a Rarity.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createRarity: {
    type: Definition,
    description: `Creates a new Rarity`,
    args: { ...Input },
    resolve: create
  },
  updateRarity: {
    type: Definition,
    description: `Updates an existing Rarity, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteRarity: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as AbilityType,
  Connection as AbilityTypeConnection,
  Filter as AbilityTypeFilter,
  Input as AbilityTypeInput,
  Order as AbilityTypeOrder
}

export default { Definition, Queries, Mutations }
