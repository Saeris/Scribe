import db from '../../config/bookshelf.config'
import { Format, Card } from './'

export default class Legality extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Indexes
    table.bigIncrements(`id`)
         .notNullable()
         .unsigned()
         .primary()
         .unique()

    // Fields
    table.bigInteger(`format`)
         .comment(`The format associated with this legality.`)
         .notNullable()
         .unsigned()
         .index(`legality_format`)

    table.boolean(`legal`)
         .comment(`True if the card is legal in the associated format.`)
         .notNullable()

    table.boolean(`restricted`)
         .comment(`True if the card is restricted in the associated format.`)
         .notNullable()

    table.bigInteger(`cards`)
         .comment(`List of cards that have this legality ruling.`)
         .notNullable()
         .unsigned()
         .index(`legality_cards`)

    // Timestamps
    table.timestamps()
  }

  // Bookshelf Relation Definitions
  get tableName() { return `legality` }

  get hasTimestamps() { return true }

  format = () => this.hasOne(Format, `format`)

  cards = () => this.belongsToMany(Card, `cards`)
}
