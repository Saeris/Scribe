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
  name: `Profile`,
  description: `A Profile object`,
  interfaces: [nodeInterface],
  sqlTable: `profile`,
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
      description: `The Printing ID`,
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
    service: {
      type: new GqlNonNull(GqlString),
      description: `The name of the social media service.`,
      sqlColumn: `service`,
      column: table => table.string(`service`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    token: {
      type: new GqlNonNull(GqlString),
      description: `The access token issued by the social media service.`,
      sqlColumn: `token`,
      column: table => table.string(`token`).notNullable().unique(),
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
  profile: {
    type: new GqlList(Definition),
    description: `Returns a Profile.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createProfile: {
    type: Definition,
    description: `Creates a new Profile`,
    args: { ...Input },
    resolve: create
  },
  updateProfile: {
    type: Definition,
    description: `Updates an existing Profile, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteProfile: {
    type: Definition,
    description: `Deletes a Profile by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Profile,
  Connection as ProfileConnection,
  Filter as ProfileFilter,
  Input as ProfileInput,
  Order as ProfileOrder
}

export default { Definition, Queries, Mutations }
