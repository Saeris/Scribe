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
  name: `Language`,
  description: `A language object`,
  interfaces: [nodeInterface],
  sqlTable: `language`,
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
      description: `The Language ID`,
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
      description: `The name of the Language.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    code: {
      type: new GqlNonNull(GqlString),
      description: `The language code.`,
      sqlColumn: `language`,
      column: table => table.string(`language`).notNullable().unique(),
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
  language: {
    type: new GqlList(Definition),
    description: `Returns a Language.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createLanguage: {
    type: Definition,
    description: `Creates a new Language`,
    args: { ...Input },
    resolve: create
  },
  updateLanguage: {
    type: Definition,
    description: `Updates an existing Language, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteLanguage: {
    type: Definition,
    description: `Deletes a Language by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Language,
  Connection as LanguageConnection,
  Filter as LanguageFilter,
  Input as LanguageInput,
  Order as LanguageOrder
}

export default { Definition, Queries, Mutations }
