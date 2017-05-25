import db from '../../config/bookshelf.config'

export default class Keywords extends db.Model {
  // Knex Schema Definitions
  static fields(table) {
    // Fields
    table.bigInteger(`card`)
      .comment(`The card associated with this keyword.`)
      .notNullable()
      .unsigned()

    table.bigInteger(`keyword`)
      .comment(`The keyword associated with this card.`)
      .notNullable()
      .unsigned()

    // Timestamps
    table.timestamps()

    // Keys
    table.primary([`card`, `keyword`])
  }

  // Bookshelf Relation Definitions
  get tableName() { return `keywords` }

  get hasTimestamps() { return true }
}
