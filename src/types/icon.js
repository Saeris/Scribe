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
  name: `Icon`,
  description: `An Icon object`,
  interfaces: [nodeInterface],
  sqlTable: `icon`,
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
      description: `The Icon ID`,
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
      description: `The name of the Icon.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    image: {
      type: new GqlNonNull(GqlURL),
      description: `The Icon Image.`,
      sqlColumn: `image`,
      column: table => table.string(`image`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlURL) }
    },
    className: {
      type: new GqlNonNull(GqlString),
      description: `A CSS class used to display this icon.`,
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
  icon: {
    type: new GqlList(Definition),
    description: `Returns an Icon.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createIcon: {
    type: Definition,
    description: `Creates a new Icon`,
    args: { ...Input },
    resolve: create
  },
  updateIcon: {
    type: Definition,
    description: `Updates an existing Icon, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteIcon: {
    type: Definition,
    description: `Deletes a Icon by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Icon,
  Connection as IconConnection,
  Filter as IconFilter,
  Input as IconInput,
  Order as IconOrder
}

export default { Definition, Queries, Mutations }
