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
import { CardConnection, CardFilter, CardOrder } from "./card"

export const Definition = new GqlObject({
  name: `AbilityType`,
  description: `An Ability Type object`,
  interfaces: [nodeInterface],
  sqlTable: `abilitytype`,
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
      description: `The Ability Type ID.`,
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
      description: `The name of the Ability Type.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    description: {
      type: new GqlNonNull(GqlString),
      description: `Description of the Ability Type.`,
      sqlColumn: `description`,
      column: table => table.string(`description`).notNullable(),
      input: true
    },
    cards: {
      type: CardConnection,
      description: `The cards associated with this Ability Type.`,
      args: { ...connectionArgs, ...CardFilter, ...CardOrder },
      junction: junction(`abilitytypecards`),
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
  abilityType: {
    type: new GqlList(Definition),
    description: `Returns a Ability Type.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createAbilityType: {
    type: Definition,
    description: `Creates a new Ability Type`,
    args: { ...Input },
    resolve: create
  },
  updateAbilityType: {
    type: Definition,
    description: `Updates an existing Ability Type, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  destroyAbilityType: {
    type: Definition,
    description: `Deletes a Ability Type by id`,
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
