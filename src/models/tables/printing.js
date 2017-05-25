import db from '../../config/bookshelf.config'
import { Card, Set, Image, Artist } from './'
import { Images, Sides, Variations } from '../lists'

export default class Printing extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    table.bigInteger(`card`)
         .comment(`The card this is a printing of.`)
         .notNullable()
         .unsigned()

    table.bigInteger(`set`)
         .comment(`The set the card printed in.`)
         .notNullable()
         .unsigned()

    table.bigInteger(`artist`)
         .comment(`The artist of the card on this printing.`)
         .notNullable()
         .unsigned()

    table.string(`originaltype`)
         .comment(`The original type on the card at the time it was printed.`)

    table.text(`originaltext`)
         .comment(`The original text on the card at the time it was printed.`)

    table.text(`flavor`)
         .comment(`The flavor text on the card for this printing.`)

    table.string(`number`)
         .comment(`The card number. This is printed at the bottom-center of the card in small text. This is a string, not an integer, because some cards have letters in their numbers.`)
         .notNullable()

    table.boolean(`timeshifted`)
         .comment(`If this card was a timeshifted card in the set.`)

    table.boolean(`starter`)
         .comment(`Set to true if this card was only released as part of a core box set. These are technically part of the core sets and are tournament legal despite not being available in boosters.`)

    table.boolean(`reserved`)
         .comment(`Set to true if this card is reserved by Wizards Official Reprint Policy.`)

    table.string(`source`)
         .comment(`For promo cards, this is where this card was originally obtained. For box sets that are theme decks, this is which theme deck the card is from.`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `printing` }

  get hasTimestamps() { return true }

  card = () => this.belongsTo(Card, `card`, `id`)

  set = () => this.belongsTo(Set, `set`, `id`)

  images = () => this.hasMany(Image, `id`).through(Images, `id`, `printing`, `image`)

  artist = () => this.hasOne(Artist, `artist`)

  sides = () => this.hasMany(Card, `id`).through(Sides, `id`, `printing`, `side`)

  variations = () => this.hasMany(Card, `id`).through(Variations, `id`, `printing`, `variation`)
}
