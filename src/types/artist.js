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
  name: `Artist`,
  description: `An Artist object`,
  interfaces: [nodeInterface],
  sqlTable: `artist`,
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
      description: `The Artist ID.`,
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
      description: `The name of the Artist.`,
      sqlColumn: `name`,
      column: table => table.string(`name`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    website: {
      type: GqlString,
      description: `A URL to the Artist's website, if they have one.`,
      sqlColumn: `website`,
      column: table => table.string(`website`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    cards: {
      type: CardConnection,
      description: `A list of cards featuring art from this Artist.`,
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
  artist: {
    type: new GqlList(Definition),
    description: `Returns a Artist.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createArtist: {
    type: Definition,
    description: `Creates a new Artist`,
    args: { ...Input },
    resolve: create
  },
  updateArtist: {
    type: Definition,
    description: `Updates an existing Artist, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteArtist: {
    type: Definition,
    description: `Deletes a Rarity by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Artist,
  Connection as ArtistConnection,
  Filter as ArtistFilter,
  Input as ArtistInput,
  Order as ArtistOrder
}

export default { Definition, Queries, Mutations }
