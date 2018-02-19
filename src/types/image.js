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
import { Language, LanguageFilter, LanguageOrder } from "./language"

export const Definition = new GqlObject({
  name: `Image`,
  description: `An Image object`,
  interfaces: [nodeInterface],
  sqlTable: `image`,
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
      description: `The Image ID`,
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
    multiverseid: {
      type: GqlString,
      description: `The multiverseid of the card on Wizard’s Gatherer web page.`,
      sqlColumn: `multiverseid`,
      column: table => table.string(`multiverseid`).unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    url: {
      type: new GqlNonNull(GqlString),
      description: `The localized image of a card.`,
      sqlColumn: `url`,
      column: table => table.string(`url`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    language: {
      type: !disabled && new GqlNonNull(Language),
      description: `The language image.`,
      sqlColumn: `language`,
      column: table => table.string(`language`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...LanguageFilter, ...LanguageOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`language`)
    }
  })
})

export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  image: {
    type: new GqlList(Definition),
    description: `Returns an Image.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createImage: {
    type: Definition,
    description: `Creates a new Image`,
    args: { ...Input },
    resolve: create
  },
  updateImage: {
    type: Definition,
    description: `Updates an existing Image, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: update
  },
  deleteImage: {
    type: Definition,
    description: `Deletes a Image by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Image,
  Connection as ImageConnection,
  Filter as ImageFilter,
  Input as ImageInput,
  Order as ImageOrder
}

export default { Definition, Queries, Mutations }
