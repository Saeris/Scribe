import db from '../../config/bookshelf.config'

export default class CardColors extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
         .comment(`The card associated with the color.`)
         .notNullable()
         .unsigned()
         .index(`cardColors_card`)

    table.bigInteger(`color`)
         .comment(`The color associated with the card.`)
         .notNullable()
         .unsigned()
         .index(`cardColors_color`)

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `color`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `cardColors` }

  get hasTimestamps() { return true }
}
