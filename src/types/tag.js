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
  name: `Tag`,
  description: `A Tag object`,
  interfaces: [nodeInterface],
  sqlTable: `tag`,
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
      description: `The Tag ID.`,
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
    tag: {
      type: new GqlNonNull(GqlString),
      description: `The text of the Tag.`,
      sqlColumn: `tag`,
      column: table => table.string(`tag`).notNullable().unique(),
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
  tag: {
    type: new GqlList(Definition),
    description: `Returns a Tag.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createTag: {
    type: Definition,
    description: `Creates a new Tag`,
    args: { ...Input },
    resolve: create
  },
  updateTag: {
    type: Definition,
    description: `Updates an existing Tag, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteTag: {
    type: Definition,
    description: `Deletes a Tag by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Tag,
  Connection as TagConnection,
  Filter as TagFilter,
  Input as TagInput,
  Order as TagOrder
}

export default { Definition, Queries, Mutations }
