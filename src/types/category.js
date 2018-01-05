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
  name: `Category`,
  description: `A Category object`,
  interfaces: [nodeInterface],
  sqlTable: `category`,
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
      description: `The Category ID.`,
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
      description: `The Category name.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(new GqlNonNull(GqlString)) }
    },
    description: {
      type: new GqlNonNull(GqlString),
      description: `Description of the Category.`,
      sqlColumn: `description`,
      column: table => table.string(`description`).notNullable(),
      input: true
    },
    cards: {
      type: CardConnection,
      description: `A list of cards that have this Category.`,
      args: { ...connectionArgs, ...CardFilter, ...CardOrder },
      junction: junction(`categorycards`),
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
  category: {
    type: new GqlList(Definition),
    description: `Returns a Category.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createCategory: {
    type: Definition,
    description: `Creates a new Category`,
    args: { ...Input },
    resolve: create
  },
  updateCategory: {
    type: Definition,
    description: `Updates an existing Category, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteCategory: {
    type: Definition,
    description: `Deletes a Category by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Category,
  Connection as CategoryConnection,
  Filter as CategoryFilter,
  Input as CategoryInput,
  Order as CategoryOrder
}

export default { Definition, Queries, Mutations }
