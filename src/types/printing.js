import {
  nodeInterface,
  DateRange,
  createFilter,
  createInput,
  createOrder,
  //create,
  read,
  //update,
  destroy,
  sqlJoin,
  junction,
  orderBy,
  where
} from "@/utilities"
import { Card, CardFilter, CardOrder } from "./card"
import { CardSet, CardSetFilter, CardSetOrder } from "./set"
import { ImageConnection, ImageFilter, ImageOrder } from "./image"
import { Artist, ArtistFilter, ArtistOrder } from "./artist"

export const Definition = new GqlObject({
  name: `Printing`,
  description: `A Printing object`,
  interfaces: [nodeInterface],
  sqlTable: `printing`,
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
    card: {
      type: Card,
      description: `The Card represented by this Printing.`,
      column: table => table.string(`card`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...CardFilter, ...CardOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`card`)
    },
    set: {
      type: !disabled && new GqlNonNull(CardSet),
      description: `The Set the Printing belongs to.`,
      column: table => table.string(`set`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...CardSetFilter, ...CardSetOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`set`)
    },
    images: {
      type: ImageConnection,
      description: `The card images. This includes a list of foreign images indexed by a language code. Example: enUS`,
      input: { type: new GqlNonNull(new GqlList(new GqlNonNull(GqlID))) },
      args: { ...connectionArgs, ...ImageFilter, ...ImageOrder },
      junction: junction(`images`),
      where,
      orderBy,
      resolve: ({ images }, args) => connectionFromArray(images, args)
    },
    artist: {
      type: !disabled && new GqlNonNull(Artist),
      description: `The artist of the image. This may not match what is on the card as MTGJSON corrects many card misprints.`,
      column: table => table.string(`artist`).notNullable(),
      input: { type: new GqlNonNull(GqlID) },
      args: { ...ArtistFilter, ...ArtistOrder },
      where,
      orderBy,
      sqlJoin: sqlJoin(`artist`)
    },
    originalType: {
      type: GqlString,
      description: `The original type on the card at the time it was printed. This field is not available for promo cards.`,
      sqlColumn: `originalType`,
      column: table => table.string(`originalType`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    originalText: {
      type: GqlString,
      description: `The original text on the card at the time it was printed. This field is not available for promo cards.`,
      sqlColumn: `originalText`,
      column: table => table.string(`originalText`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    flavor: {
      type: GqlString,
      description: `The flavor text of the card.`,
      sqlColumn: `flavor`,
      column: table => table.string(`flavor`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    number: {
      type: GqlString,
      description: `The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`,
      sqlColumn: `number`,
      column: table => table.string(`number`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    timeshifted: {
      type: new GqlNonNull(GqlBool),
      description: `If this card was a timeshifted card in the set.`,
      sqlColumn: `timeshifted`,
      column: table => table.boolean(`timeshifted`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlNonNull(GqlBool) }
    },
    starter: {
      type: new GqlNonNull(GqlBool),
      description: `Set to true if this card was only released as part of a core box set. These are technically part of the core sets and are tournament legal despite not being available in boosters.`,
      sqlColumn: `starter`,
      column: table => table.boolean(`starter`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlNonNull(GqlBool) }
    },
    reserved: {
      type: new GqlNonNull(GqlBool),
      description: `Set to true if this card is reserved by Wizards Official Reprint Policy`,
      sqlColumn: `reserved`,
      column: table => table.boolean(`reserved`).notNullable(),
      input: true,
      sortable: true,
      filter: { type: new GqlNonNull(GqlBool) }
    },
    source: {
      type: GqlString,
      description: `For promo cards, this is where this card was originally obtained. For box sets that are theme decks, this is which theme deck the card is from.`,
      sqlColumn: `source`,
      column: table => table.string(`source`),
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
  printing: {
    type: new GqlList(Definition),
    description: `Returns a Printing.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createPrinting: {
    type: Definition,
    description: `Creates a new Printing`,
    args: { ...Input },
    resolve: (parent, { input }, context) => {
      let { images, sides, variations, ...fields } = input //eslint-disable-line
      /*
      return Models.Printing
        .findOrCreate(fields)
        .then(model => {
          const printing = model.toJSON()

          if (!!images) for (let image of images) Models.Images.findOrCreate({ printing: printing.id, image })

          Models.Printings.findOrCreate({ card: printing.card, printing: printing.id })

          return printing
        })
        .catch(err => error(`Failed to run Mutation: create${Definition.name}`, err))
        .finally(info(`Resolved Mutation: create${Definition.name}`, { parent, input, context}))
        */
    }
  },
  updatePrinting: {
    type: Definition,
    description: `Updates an existing Printing, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: (parent, { input }, context) => {
      const { card, set, number, images, sides, variations, ...fields } = input //eslint-disable-line
      /*
      return Models.Printing
        .upsert({ card, set, number }, fields)
        .then(model => {
          const printing = model.toJSON()
          info(model)
          if (!!images) for (let image of images) Models.Images.findOrCreate({ printing: printing.id, image })

          Models.Printings.findOrCreate({ card: printing.card, printing: printing.id })

          return printing
        })
        .catch(err => error(`Failed to run Mutation: update${Definition.name}`, err))
        .finally(info(`Resolved Mutation: update${Definition.name}`, { parent, input, context}))
        */
    }
  },
  deleteCard: {
    type: Definition,
    description: `Deletes a Card by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: destroy
  }
}

export {
  Definition as Printing,
  Connection as PrintingConnection,
  Filter as PrintingFilter,
  Input as PrintingInput,
  Order as PrintingOrder
}

export default { Definition, Queries, Mutations }
